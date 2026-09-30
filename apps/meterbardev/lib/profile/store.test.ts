import { afterAll, beforeAll, describe, expect, test } from "bun:test"

import { parseProfile, type ProfileDocument } from "./schema"
import {
  deleteProfile,
  hashKey,
  MIN_WRITE_INTERVAL_MS,
  writeProfile,
} from "./service"
import {
  MemoryProfileStore,
  PROFILE_TTL_SECONDS,
  UpstashProfileStore,
  type ProfileStore,
  type StoredProfile,
} from "./store"
import { startTestRedis } from "./test-support/redis"

const slug = "abcdefghjk"
const keyA = "A".repeat(43)
const keyB = "B".repeat(43)
const document = parseProfile({
  schema: 1,
  updatedAt: "2026-09-29T20:00:00Z",
  providers: [
    {
      provider: "Claude Code",
      name: "Claude Code",
      windows: [{ label: "Weekly", usedPercent: 10 }],
    },
  ],
}) as ProfileDocument
const stored = (key: string, storedAt: number): StoredProfile => ({
  document,
  keyHash: hashKey(key),
  storedAt,
})

let localRedis: Awaited<ReturnType<typeof startTestRedis>>
beforeAll(async () => {
  localRedis = await startTestRedis()
})
afterAll(async () => {
  await localRedis?.stop()
})

for (const adapter of ["memory", "upstash"] as const) {
  describe(`${adapter} atomic profile storage`, () => {
    async function setup() {
      let now = 1_800_000_000_000
      let store: ProfileStore
      if (adapter === "memory") store = new MemoryProfileStore(() => now)
      else {
        await localRedis.redis.flushdb()
        store = new UpstashProfileStore(localRedis.redis)
      }
      const advance = (ms: number) => {
        now += ms
      }
      const expire = async () => {
        advance(PROFILE_TTL_SECONDS * 1000 + 1)
        if (adapter === "upstash")
          await localRedis.redis.pexpire(`profile:${slug}`, 0)
      }
      const write = (key = keyA, target = store) =>
        writeProfile(target, {
          slug,
          key,
          body: document,
          address: "203.0.113.1",
          now,
        })
      return { store, advance, expire, write, now: () => now }
    }

    test("simultaneous first claims have exactly one winner", async () => {
      const { store } = await setup()
      const results = await Promise.all([
        store.setIfAbsent(slug, stored(keyA, 1)),
        store.setIfAbsent(slug, stored(keyB, 1)),
      ])
      expect(results.filter(Boolean)).toHaveLength(1)
      expect((await store.get(slug))?.keyHash).toBe(
        hashKey(results[0] ? keyA : keyB)
      )
    })

    test("an update paused after reading cannot overwrite an expired/reclaimed slug", async () => {
      const { store, write, expire } = await setup()
      expect(await write()).toBe("ok")
      const racing: ProfileStore = {
        get: async (target) => {
          const old = await store.get(target)
          await expire()
          expect(await write(keyB)).toBe("ok")
          return old
        },
        setIfAbsent: store.setIfAbsent.bind(store),
        updateOwned: store.updateOwned.bind(store),
        deleteOwned: store.deleteOwned.bind(store),
        count: store.count.bind(store),
      }
      // Supply an old read that has passed the write floor.
      const outcome = await writeProfile(racing, {
        slug,
        key: keyA,
        body: document,
        address: "203.0.113.2",
        now: 1_800_000_000_000 + MIN_WRITE_INTERVAL_MS,
      })
      expect(outcome).toBe("forbidden")
      expect((await store.get(slug))?.keyHash).toBe(hashKey(keyB))
    })

    test("a delete started by the previous owner cannot remove a reclaimed record", async () => {
      const { store, write, expire } = await setup()
      await write()
      const racing: ProfileStore = {
        get: store.get.bind(store),
        setIfAbsent: store.setIfAbsent.bind(store),
        updateOwned: store.updateOwned.bind(store),
        count: store.count.bind(store),
        deleteOwned: async (target, owner) => {
          await expire()
          expect(await write(keyB)).toBe("ok")
          return store.deleteOwned(target, owner)
        },
      }
      expect(await deleteProfile(racing, { slug, key: keyA })).toBe("forbidden")
      expect((await store.get(slug))?.keyHash).toBe(hashKey(keyB))
    })

    test("concurrent owner updates enforce the write floor inside the mutation", async () => {
      const { store, write, advance, now } = await setup()
      await write()
      advance(MIN_WRITE_INTERVAL_MS)
      const value = stored(keyA, now())
      const outcomes = await Promise.all([
        store.updateOwned(slug, value, MIN_WRITE_INTERVAL_MS),
        store.updateOwned(slug, value, MIN_WRITE_INTERVAL_MS),
      ])
      expect(outcomes.sort()).toEqual(["ok", "too_soon"])
    })

    test("expiry between read and update can reclaim only a still-free slug", async () => {
      const { store, write, advance, expire } = await setup()
      await write()
      advance(MIN_WRITE_INTERVAL_MS)
      const racing: ProfileStore = {
        get: async (target) => {
          const old = await store.get(target)
          await expire()
          return old
        },
        setIfAbsent: store.setIfAbsent.bind(store),
        updateOwned: store.updateOwned.bind(store),
        deleteOwned: store.deleteOwned.bind(store),
        count: store.count.bind(store),
      }
      expect(await write(keyA, racing)).toBe("ok")
      expect((await store.get(slug))?.keyHash).toBe(hashKey(keyA))
    })

    test("an owner update refreshes the full seven-day TTL", async () => {
      const { store, write, advance } = await setup()
      await write()
      advance(PROFILE_TTL_SECONDS * 1000 - 1000)
      if (adapter === "upstash")
        await localRedis.redis.pexpire(`profile:${slug}`, 1000)
      expect(await write()).toBe("ok")
      if (adapter === "upstash") {
        const ttl = await localRedis.redis.ttl(`profile:${slug}`)
        expect(ttl).toBeGreaterThan(PROFILE_TTL_SECONDS - 2)
        expect(ttl).toBeLessThanOrEqual(PROFILE_TTL_SECONDS)
      } else {
        advance(2000)
        expect(await store.get(slug)).not.toBeNull()
        advance(PROFILE_TTL_SECONDS * 1000)
        expect(await store.get(slug)).toBeNull()
      }
    })

    test("owner deletes are idempotent and never expose the publish key", async () => {
      const { store, write } = await setup()
      await write()
      expect(JSON.stringify(await store.get(slug))).not.toContain(keyA)
      expect(await deleteProfile(store, { slug, key: keyA })).toBe("ok")
      expect(await store.get(slug)).toBeNull()
      expect(await deleteProfile(store, { slug, key: keyA })).toBe("ok")
    })

    test("counters count concurrent calls once and reset after the bounded window", async () => {
      const { store, advance } = await setup()
      const counts = await Promise.all(
        Array.from({ length: 20 }, () => store.count("test", 60))
      )
      expect(counts.sort((a, b) => a - b)).toEqual(
        Array.from({ length: 20 }, (_, i) => i + 1)
      )
      if (adapter === "upstash") {
        expect(await localRedis.redis.ttl("rate:test")).toBeGreaterThan(0)
        expect(await localRedis.redis.ttl("rate:test")).toBeLessThanOrEqual(60)
        await localRedis.redis.pexpire("rate:test", 0)
      } else advance(60_000)
      expect(await store.count("test", 60)).toBe(1)
    })
  })
}

describe("Upstash counter TTL recovery", () => {
  test("an interrupted legacy counter gets a TTL without resetting its count", async () => {
    await localRedis.redis.set("rate:orphan", 8)
    expect(await localRedis.redis.ttl("rate:orphan")).toBe(-1)
    const store = new UpstashProfileStore(localRedis.redis)
    expect(await store.count("orphan", 3600)).toBe(9)
    expect(await localRedis.redis.ttl("rate:orphan")).toBeGreaterThan(0)
    expect(await localRedis.redis.ttl("rate:orphan")).toBeLessThanOrEqual(3600)
  })

  test("later increments do not extend an existing deadline", async () => {
    await localRedis.redis.set("rate:deadline", 1, { px: 10_000 })
    const before = await localRedis.redis.pttl("rate:deadline")
    const store = new UpstashProfileStore(localRedis.redis)
    expect(await store.count("deadline", 3600)).toBe(2)
    expect(await localRedis.redis.pttl("rate:deadline")).toBeLessThanOrEqual(
      before
    )
  })
})
