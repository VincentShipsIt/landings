import { describe, expect, test } from "bun:test"

import { deleteProfile, readProfile, writeProfile } from "./service"
import { MemoryProfileStore, PROFILE_TTL_SECONDS } from "./store"

const slug = "abcdefghjk"
const keyA = "A".repeat(43)
const keyB = "B".repeat(43)
const doc = {
  schema: 1,
  updatedAt: "2026-09-29T20:00:00Z",
  providers: [
    {
      provider: "Claude Code",
      name: "Claude Code",
      plan: null,
      windows: [
        { label: "Weekly", usedPercent: 10, resetsAt: null, pace: null },
      ],
    },
  ],
  receipt: null,
}

function setup() {
  let now = 1_800_000_000_000
  const store = new MemoryProfileStore(() => now)
  return {
    store,
    advance: (ms: number) => (now += ms),
    write: (over: Partial<Parameters<typeof writeProfile>[1]> = {}) =>
      writeProfile(store, {
        address: "203.0.113.1",
        body: doc,
        key: keyA,
        now,
        slug,
        ...over,
      }),
  }
}

describe("writeProfile", () => {
  test("first write claims the slug and the page can read it", async () => {
    const { store, write } = setup()
    expect(await write()).toBe("ok")
    expect((await readProfile(store, slug))?.providers[0]?.name).toBe(
      "Claude Code"
    )
  })

  test("the publish key is stored only as a hash", async () => {
    const { store, write } = setup()
    await write()
    expect(store.dump()).not.toContain(keyA)
  })

  test("a different key cannot overwrite or delete a claimed slug", async () => {
    const { store, write, advance } = setup()
    await write()
    advance(60_000)
    expect(await write({ key: keyB })).toBe("forbidden")
    expect(await deleteProfile(store, { key: keyB, slug })).toBe("forbidden")
    expect(await readProfile(store, slug)).not.toBeNull()
  })

  test("the owner can update, but not faster than the write floor", async () => {
    const { write, advance } = setup()
    await write()
    advance(5_000)
    expect(await write()).toBe("too_soon")
    advance(30_000)
    expect(await write()).toBe("ok")
  })

  test("rejects malformed keys and bodies before touching storage", async () => {
    const { store, write } = setup()
    expect(await write({ key: "short" })).toBe("invalid")
    expect(
      await write({ key: "bad key with spaces!!!!!!!!!!!!!!!!!!!!!" })
    ).toBe("invalid")
    expect(await write({ body: { ...doc, schema: 9 } })).toBe("invalid")
    expect(store.dump()).toBe("[]")
  })

  test("stores the rebuilt document, not the raw body", async () => {
    const { store, write } = setup()
    await write({ body: { ...doc, email: "me@example.com" } })
    expect(store.dump()).not.toContain("example.com")
  })

  test("one address can claim only a few new slugs an hour", async () => {
    const { write } = setup()
    const slugs = Array.from(
      { length: 12 },
      (_, i) => `abcdefghj${"abcdefghjkmnpq"[i]}`
    )
    const results: string[] = []
    for (const s of slugs) results.push(await write({ slug: s }))
    expect(results.slice(0, 10).every((r) => r === "ok")).toBe(true)
    expect(results.slice(10)).toEqual(["rate_limited", "rate_limited"])
  })

  test("updating your own profile does not spend a claim", async () => {
    const { write, advance } = setup()
    for (let i = 0; i < 15; i++) {
      advance(31_000)
      expect(await write()).toBe("ok")
    }
  })

  test("a profile expires after its TTL", async () => {
    const { store, write, advance } = setup()
    await write()
    advance(PROFILE_TTL_SECONDS * 1000 + 1)
    expect(await readProfile(store, slug)).toBeNull()
    // and the slug is free to claim again
    expect(await write({ key: keyB })).toBe("ok")
  })
})

describe("deleteProfile", () => {
  test("deletes for the owner, and is idempotent", async () => {
    const { store, write } = setup()
    await write()
    expect(await deleteProfile(store, { key: keyA, slug })).toBe("ok")
    expect(await readProfile(store, slug)).toBeNull()
    expect(await deleteProfile(store, { key: keyA, slug })).toBe("ok")
  })

  test("rejects malformed keys", async () => {
    const { store } = setup()
    expect(await deleteProfile(store, { key: "x", slug })).toBe("invalid")
  })
})
