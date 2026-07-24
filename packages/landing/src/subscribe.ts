import type { LandingProduct } from "./types"

// Deliberately permissive: the authoritative check is the confirmation email,
// so this only rejects input that cannot be an address at all.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function json(body: Record<string, string>, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  })
}

/**
 * Forwards a launch-notification signup to whichever provider the deployment
 * configures through `SUBSCRIBE_WEBHOOK_URL` (Buttondown, ConvertKit, a Zapier
 * catch hook, …). No vendor SDK is baked in, so switching providers is an
 * environment change rather than a code change.
 */
export async function handleSubscribe(
  request: Request,
  product: LandingProduct
) {
  let email: unknown

  try {
    const payload = (await request.json()) as { email?: unknown }

    email = payload.email
  } catch {
    return json({ error: "Send a JSON body with an email field." }, 400)
  }

  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    return json({ error: "Enter a valid email address." }, 400)
  }

  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL?.trim()

  if (!webhook) {
    console.error(
      `[landing] SUBSCRIBE_WEBHOOK_URL is not set; dropped a ${product.domain} signup`
    )

    return json(
      { error: "Signups are not wired up yet. Please try again later." },
      503
    )
  }

  try {
    const response = await fetch(webhook, {
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        product: product.name,
        source: product.domain,
      }),
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    if (!response.ok) {
      console.error(
        `[landing] Subscribe webhook rejected a ${product.domain} signup: ${response.status} ${response.statusText}`
      )

      return json({ error: "Could not save that address. Try again." }, 502)
    }
  } catch (error) {
    console.error(
      `[landing] Subscribe webhook threw for ${product.domain}:`,
      error
    )

    return json({ error: "Could not save that address. Try again." }, 502)
  }

  return json({ status: "subscribed" }, 202)
}
