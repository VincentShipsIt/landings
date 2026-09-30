import { expect, test } from "bun:test"

import { GET } from "../../app/u/[slug]/og/route"
import { getPublicProfile } from "./cache"
import { deleteProfile, writeProfile } from "./service"
import { getProfileStore } from "./store"

const slug = "0123456789"
const key = "C".repeat(43)
const context = { params: Promise.resolve({ slug }) }
const request = new Request(`http://localhost/u/${slug}/og`)

test("a previously read profile and rendered OG card are gone on the next request after delete", async () => {
  const store = getProfileStore()!
  expect(
    await writeProfile(store, {
      slug,
      key,
      address: "203.0.113.1",
      body: {
        schema: 1,
        updatedAt: "2026-09-29T20:00:00Z",
        providers: [
          {
            provider: "Codex CLI",
            name: "OpenAI Codex",
            windows: [{ label: "Weekly", usedPercent: 17 }],
          },
        ],
      },
    })
  ).toBe("ok")
  expect(await getPublicProfile(slug)).not.toBeNull()
  const live = await GET(request, context)
  expect(live.status).toBe(200)
  expect(live.headers.get("Cache-Control")).toBe("no-store")
  expect(live.headers.get("X-Robots-Tag")).toBe("noindex, nofollow")
  // Consume the real ImageResponse to verify the 1200x630 PNG still renders.
  const png = new DataView(await live.arrayBuffer())
  expect(png.getUint32(0)).toBe(0x89504e47)
  expect(png.getUint32(16)).toBe(1200)
  expect(png.getUint32(20)).toBe(630)

  expect(await deleteProfile(store, { slug, key })).toBe("ok")
  expect(await getPublicProfile(slug)).toBeNull()
  const deleted = await GET(request, context)
  expect(deleted.status).toBe(404)
  expect(deleted.headers.get("Cache-Control")).toBe("no-store")
  expect((await deleted.arrayBuffer()).byteLength).toBe(0)
})

test("invalid and missing slugs never produce a cacheable card", async () => {
  for (const slug of ["invalid", "zzzzzzzzzz"]) {
    const response = await GET(request, { params: Promise.resolve({ slug }) })
    expect(response.status).toBe(404)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
  }
})
