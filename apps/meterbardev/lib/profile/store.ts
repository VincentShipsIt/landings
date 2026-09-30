import { Redis } from "@upstash/redis"

import type { ProfileDocument } from "./schema"

/** A profile is dropped this long after its last write, whatever else happens. */
export const PROFILE_TTL_SECONDS = 7 * 24 * 60 * 60

export type StoredProfile = {
  /** SHA-256 (hex) of the publish key. The key itself is never stored. */
  keyHash: string
  document: ProfileDocument
  /** Server clock, ms. Never taken from the client. */
  storedAt: number
}

export type UpdateOutcome = "ok" | "missing" | "forbidden" | "too_soon"
export type OwnedDeleteOutcome = "ok" | "forbidden"

/** Ownership checks and mutations must run as one indivisible operation. */
export interface ProfileStore {
  get(slug: string): Promise<StoredProfile | null>
  /** Writes only if the slug is free. Returns whether it wrote. */
  setIfAbsent(slug: string, value: StoredProfile): Promise<boolean>
  /** Checks the current owner and write floor, then refreshes the record/TTL. */
  updateOwned(
    slug: string,
    value: StoredProfile,
    minimumIntervalMs: number
  ): Promise<UpdateOutcome>
  /** Missing is success; another owner's record must remain untouched. */
  deleteOwned(slug: string, keyHash: string): Promise<OwnedDeleteOutcome>
  /** Counts an event in a window, returning the new count. */
  count(bucket: string, windowSeconds: number): Promise<number>
}

const keyFor = (slug: string) => `profile:${slug}`

// Redis runs each script atomically, including the GET, owner check and SET/DEL.
const UPDATE_OWNED = `
local raw = redis.call("GET", KEYS[1])
if not raw then return "missing" end
local current = cjson.decode(raw)
if current.keyHash ~= ARGV[1] then return "forbidden" end
if tonumber(ARGV[2]) - current.storedAt < tonumber(ARGV[3]) then
  return "too_soon"
end
redis.call("SET", KEYS[1], ARGV[4], "EX", ARGV[5])
return "ok"
`

const DELETE_OWNED = `
local raw = redis.call("GET", KEYS[1])
if not raw then return "ok" end
if cjson.decode(raw).keyHash ~= ARGV[1] then return "forbidden" end
redis.call("DEL", KEYS[1])
return "ok"
`

export class UpstashProfileStore implements ProfileStore {
  constructor(private readonly redis: Redis) {}

  async get(slug: string) {
    return this.redis.get<StoredProfile>(keyFor(slug))
  }

  async setIfAbsent(slug: string, value: StoredProfile) {
    const result = await this.redis.set(keyFor(slug), value, {
      ex: PROFILE_TTL_SECONDS,
      nx: true,
    })
    return result === "OK"
  }

  async updateOwned(
    slug: string,
    value: StoredProfile,
    minimumIntervalMs: number
  ): Promise<UpdateOutcome> {
    return this.redis.eval(
      UPDATE_OWNED,
      [keyFor(slug)],
      [
        value.keyHash,
        value.storedAt,
        minimumIntervalMs,
        JSON.stringify(value),
        PROFILE_TTL_SECONDS,
      ]
    )
  }

  async deleteOwned(
    slug: string,
    keyHash: string
  ): Promise<OwnedDeleteOutcome> {
    return this.redis.eval(DELETE_OWNED, [keyFor(slug)], [keyHash])
  }

  async count(bucket: string, windowSeconds: number) {
    const key = `rate:${bucket}`
    // NX repairs an existing counter without a TTL, without extending a live
    // window. MULTI/EXEC prevents an interrupted request leaving a bare INCR.
    const [value] = await this.redis
      .multi()
      .incr(key)
      .expire(key, windowSeconds, "NX")
      .exec<[number, number]>()
    return value
  }
}

/** In-memory store for local development and tests. Not used in production. */
export class MemoryProfileStore implements ProfileStore {
  private readonly items = new Map<
    string,
    { value: StoredProfile; expires: number }
  >()
  private readonly counters = new Map<
    string,
    { value: number; expires: number }
  >()

  constructor(private readonly now: () => number = Date.now) {}

  async get(slug: string) {
    const value = this.current(slug)
    return value ? structuredClone(value) : null
  }

  async setIfAbsent(slug: string, value: StoredProfile) {
    if (this.current(slug)) return false
    this.write(slug, value)
    return true
  }

  async updateOwned(
    slug: string,
    value: StoredProfile,
    minimumIntervalMs: number
  ): Promise<UpdateOutcome> {
    // No await between reading and mutating: mirrors the Redis script.
    const current = this.current(slug)
    if (!current) return "missing"
    if (current.keyHash !== value.keyHash) return "forbidden"
    if (value.storedAt - current.storedAt < minimumIntervalMs) return "too_soon"
    this.write(slug, value)
    return "ok"
  }

  async deleteOwned(
    slug: string,
    keyHash: string
  ): Promise<OwnedDeleteOutcome> {
    const current = this.current(slug)
    if (current && current.keyHash !== keyHash) return "forbidden"
    this.items.delete(keyFor(slug))
    return "ok"
  }

  async count(bucket: string, windowSeconds: number) {
    const existing = this.counters.get(bucket)
    if (!existing || existing.expires <= this.now()) {
      this.counters.set(bucket, {
        value: 1,
        expires: this.now() + windowSeconds * 1000,
      })
      return 1
    }
    existing.value += 1
    return existing.value
  }

  /** Test helper: the stored bytes, to assert what a store would hold. */
  dump(): string {
    return JSON.stringify([...this.items.entries()])
  }

  private current(slug: string): StoredProfile | null {
    const item = this.items.get(keyFor(slug))
    if (!item) return null
    if (item.expires <= this.now()) {
      this.items.delete(keyFor(slug))
      return null
    }
    return item.value
  }

  private write(slug: string, value: StoredProfile) {
    this.items.set(keyFor(slug), {
      value: structuredClone(value),
      expires: this.now() + PROFILE_TTL_SECONDS * 1000,
    })
  }
}

/**
 * Next bundles pages and route handlers as separate module graphs, so a plain
 * module-level store would give the API and the page different memories in
 * `next dev`. Parking the development store on `globalThis` shares it.
 */
const globalStore = globalThis as typeof globalThis & {
  __meterbarDevProfileStore?: MemoryProfileStore
}

let cached: ProfileStore | null | undefined

/**
 * The store for this deployment. Vercel's Upstash integration injects either
 * the `UPSTASH_REDIS_REST_*` or the older `KV_REST_API_*` names. With neither,
 * development gets an in-memory store and production gets `null`, which the
 * routes turn into a 503 rather than pretending to save.
 */
export function getProfileStore(): ProfileStore | null {
  if (cached !== undefined) return cached
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (url && token) {
    cached = new UpstashProfileStore(new Redis({ token, url }))
  } else if (process.env.NODE_ENV !== "production") {
    globalStore.__meterbarDevProfileStore ??= new MemoryProfileStore()
    cached = globalStore.__meterbarDevProfileStore
  } else {
    cached = null
  }
  return cached
}
