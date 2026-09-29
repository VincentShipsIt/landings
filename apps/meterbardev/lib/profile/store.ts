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

/** The four operations the profile service needs from a key-value store. */
export interface ProfileStore {
  get(slug: string): Promise<StoredProfile | null>
  /** Writes only if the slug is free. Returns whether it wrote. */
  setIfAbsent(slug: string, value: StoredProfile): Promise<boolean>
  /** Writes only if the slug exists. Returns whether it wrote. */
  setIfPresent(slug: string, value: StoredProfile): Promise<boolean>
  delete(slug: string): Promise<void>
  /** Counts an event in a window, returning the new count. */
  count(bucket: string, windowSeconds: number): Promise<number>
}

const keyFor = (slug: string) => `profile:${slug}`

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

  async setIfPresent(slug: string, value: StoredProfile) {
    const result = await this.redis.set(keyFor(slug), value, {
      ex: PROFILE_TTL_SECONDS,
      xx: true,
    })
    return result === "OK"
  }

  async delete(slug: string) {
    await this.redis.del(keyFor(slug))
  }

  async count(bucket: string, windowSeconds: number) {
    const value = await this.redis.incr(`rate:${bucket}`)
    if (value === 1) await this.redis.expire(`rate:${bucket}`, windowSeconds)
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
    const item = this.items.get(keyFor(slug))
    if (!item) return null
    if (item.expires <= this.now()) {
      this.items.delete(keyFor(slug))
      return null
    }
    return structuredClone(item.value)
  }

  async setIfAbsent(slug: string, value: StoredProfile) {
    if (await this.get(slug)) return false
    this.write(slug, value)
    return true
  }

  async setIfPresent(slug: string, value: StoredProfile) {
    if (!(await this.get(slug))) return false
    this.write(slug, value)
    return true
  }

  async delete(slug: string) {
    this.items.delete(keyFor(slug))
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
