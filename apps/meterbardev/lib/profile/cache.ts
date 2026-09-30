import { revalidatePath, revalidateTag } from "next/cache"
import { cache } from "react"

import { readProfile } from "./service"
import { getProfileStore } from "./store"

/**
 * Dedupe metadata/page reads within a server render only. Never retain profile
 * data across requests: deleted and Redis-expired records must disappear at
 * once, including when an older read was in flight during deletion.
 */
export const getPublicProfile = cache(async (slug: string) => {
  const store = getProfileStore()
  return store ? readProfile(store, slug) : null
})

/** Also invalidate entries created by the previous cached implementation. */
export function expireProfile(slug: string) {
  revalidateTag(`profile:${slug}`, { expire: 0 })
  revalidatePath(`/u/${slug}`)
  revalidatePath(`/u/${slug}/og`)
}
