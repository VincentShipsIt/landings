import { getPublicProfile } from "@/lib/profile/cache"
import { renderProfileCard } from "@/lib/profile/card"
import { isValidSlug } from "@/lib/profile/schema"

/**
 * Read current storage on every request, with no application, browser or CDN
 * cache. Social platforms keep their own copies, which we cannot revoke.
 */
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!isValidSlug(slug))
    return new Response(null, {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    })
  const profile = await getPublicProfile(slug)
  if (!profile) {
    return new Response(null, {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    })
  }
  const image = renderProfileCard(profile)
  image.headers.set("Cache-Control", "no-store")
  image.headers.set("X-Robots-Tag", "noindex, nofollow")
  return image
}
