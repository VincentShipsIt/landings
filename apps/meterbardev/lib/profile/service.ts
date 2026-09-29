import { createHash, timingSafeEqual } from "node:crypto"

import { parseProfile, type ProfileDocument } from "./schema"
import type { ProfileStore } from "./store"

export const MIN_WRITE_INTERVAL_MS = 30_000
/** New profiles one address may claim per hour. */
export const CLAIMS_PER_HOUR = 10

export const KEY_PATTERN = /^[A-Za-z0-9_-]{32,64}$/

export type WriteOutcome =
  "ok" | "invalid" | "forbidden" | "conflict" | "too_soon" | "rate_limited"

export const hashKey = (key: string) =>
  createHash("sha256").update(key).digest("hex")

/** Addresses are counted, never stored: the bucket key is a hash. */
export const addressBucket = (address: string, now: number) =>
  `claims:${createHash("sha256").update(address).digest("hex").slice(0, 24)}:${Math.floor(now / 3_600_000)}`

function keyMatches(stored: string, presented: string) {
  const a = Buffer.from(stored, "hex")
  const b = Buffer.from(presented, "hex")
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function writeProfile(
  store: ProfileStore,
  input: {
    slug: string
    key: string
    body: unknown
    address: string
    now?: number
  }
): Promise<WriteOutcome> {
  const now = input.now ?? Date.now()
  if (!KEY_PATTERN.test(input.key)) return "invalid"
  const document = parseProfile(input.body)
  if (!document) return "invalid"

  const keyHash = hashKey(input.key)
  const value = { document, keyHash, storedAt: now }
  const existing = await store.get(input.slug)

  if (existing) {
    if (!keyMatches(existing.keyHash, keyHash)) return "forbidden"
    if (now - existing.storedAt < MIN_WRITE_INTERVAL_MS) return "too_soon"
    if (await store.setIfPresent(input.slug, value)) return "ok"
    // Expired between the read and the write: fall through and claim it again.
  }

  const claims = await store.count(addressBucket(input.address, now), 3600)
  if (claims > CLAIMS_PER_HOUR) return "rate_limited"
  return (await store.setIfAbsent(input.slug, value)) ? "ok" : "conflict"
}

export type DeleteOutcome = "ok" | "forbidden" | "invalid"

/** Idempotent: a slug that is already gone is deleted. */
export async function deleteProfile(
  store: ProfileStore,
  input: { slug: string; key: string }
): Promise<DeleteOutcome> {
  if (!KEY_PATTERN.test(input.key)) return "invalid"
  const existing = await store.get(input.slug)
  if (!existing) return "ok"
  if (!keyMatches(existing.keyHash, hashKey(input.key))) return "forbidden"
  await store.delete(input.slug)
  return "ok"
}

/** The public view: the document and nothing that authorizes writes. */
export async function readProfile(
  store: ProfileStore,
  slug: string
): Promise<ProfileDocument | null> {
  return (await store.get(slug))?.document ?? null
}
