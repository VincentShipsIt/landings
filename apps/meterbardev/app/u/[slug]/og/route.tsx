import { getCachedProfile } from "@/lib/profile/cache"
import { renderProfileCard } from "@/lib/profile/card"
import { isValidSlug } from "@/lib/profile/schema"

/**
 * The Open Graph / X card for a profile. A route handler rather than the
 * `opengraph-image` convention so its cache lifetime is explicit: five minutes
 * at the CDN and no stale-while-revalidate, so an unpublished profile's card
 * stops being served quickly. Social platforms keep their own copy of a card
 * for longer than that, and only they can expire it.
 */
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!isValidSlug(slug)) return new Response(null, { status: 404 })
  const profile = await getCachedProfile(slug)
  if (!profile) {
    return new Response(null, {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    })
  }
  const image = renderProfileCard(profile)
  image.headers.set("Cache-Control", "public, max-age=300, s-maxage=300")
  return image
}
