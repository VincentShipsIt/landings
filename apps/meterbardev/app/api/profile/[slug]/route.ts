import { readProfileBody } from "@/lib/profile/body"
import { expireProfile } from "@/lib/profile/cache"
import { deleteProfile, writeProfile } from "@/lib/profile/service"
import { isValidSlug } from "@/lib/profile/schema"
import { getProfileStore } from "@/lib/profile/store"

/**
 * The MeterBar app's endpoint for its opt-in public profile. The contract is
 * docs/public-profile-contract.md in the app repo.
 *
 * Every response is `no-store`, carries no body, and never echoes the key. The
 * `Authorization` header is read here and nowhere else, and is never logged.
 */
export const dynamic = "force-dynamic"

type Context = { params: Promise<{ slug: string }> }

const respond = (status: number, headers: Record<string, string> = {}) =>
  new Response(null, {
    headers: { "Cache-Control": "no-store", ...headers },
    status,
  })

function bearerKey(request: Request): string | null {
  const header = request.headers.get("authorization") ?? ""
  const match = /^Bearer ([A-Za-z0-9_-]+)$/.exec(header)
  return match?.[1] ?? null
}

function callerAddress(request: Request): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim()
  return forwarded || request.headers.get("x-real-ip") || "unknown"
}

export async function PUT(request: Request, { params }: Context) {
  const { slug } = await params
  if (!isValidSlug(slug)) return respond(404)
  const store = getProfileStore()
  if (!store) return respond(503)
  const key = bearerKey(request)
  if (!key) return respond(401)

  const parsed = await readProfileBody(request)
  if (parsed.status) return respond(parsed.status)

  const outcome = await writeProfile(store, {
    address: callerAddress(request),
    body: parsed.body,
    key,
    slug,
  })
  switch (outcome) {
    case "ok":
      expireProfile(slug)
      return respond(204)
    case "invalid":
      return respond(400)
    case "forbidden":
      return respond(403)
    case "conflict":
      return respond(409)
    case "too_soon":
      return respond(429, { "Retry-After": "30" })
    case "rate_limited":
      return respond(429, { "Retry-After": "3600" })
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const { slug } = await params
  if (!isValidSlug(slug)) return respond(404)
  const store = getProfileStore()
  if (!store) return respond(503)
  const key = bearerKey(request)
  if (!key) return respond(401)

  const outcome = await deleteProfile(store, { key, slug })
  if (outcome === "invalid") return respond(400)
  if (outcome === "forbidden") return respond(403)
  expireProfile(slug)
  return respond(204)
}
