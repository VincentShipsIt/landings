import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"

import { readProfile } from "./service"
import type { ProfileDocument } from "./schema"
import { getProfileStore } from "./store"

export const PAGE_REVALIDATE_SECONDS = 60

export const profileTag = (slug: string) => `profile:${slug}`

/**
 * The profile as the public page and card see it, cached for a minute so page
 * views do not spend a storage command each. A write or a delete expires the
 * entry at once (see `expireProfile`), so an unpublished profile is not served
 * from this cache.
 */
export const getCachedProfile = (
  slug: string
): Promise<ProfileDocument | null> =>
  unstable_cache(
    async () => {
      const store = getProfileStore()
      return store ? readProfile(store, slug) : null
    },
    ["public-profile", slug],
    { revalidate: PAGE_REVALIDATE_SECONDS, tags: [profileTag(slug)] }
  )()

/** Drops every cached copy of a profile now, not after the stale window. */
export function expireProfile(slug: string) {
  revalidateTag(profileTag(slug), { expire: 0 })
  revalidatePath(`/u/${slug}`)
}
