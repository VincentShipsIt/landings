import type { LandingProduct } from "./types"

type GitHubRelease = {
  assets?: Array<{
    browser_download_url?: unknown
    name?: unknown
  }>
}

type NextFetchInit = RequestInit & {
  next: { revalidate: number }
}

const NON_MAC_PLATFORM = /Android|CrOS|iPad|iPhone|Linux|Windows/i
const MAC_PLATFORM = /Macintosh|Mac OS X/i

function isMacRequest(request: Request) {
  const clientPlatform = request.headers
    .get("sec-ch-ua-platform")
    ?.replaceAll('"', "")
    .trim()

  if (clientPlatform) {
    return clientPlatform.toLowerCase() === "macos"
  }

  const userAgent = request.headers.get("user-agent") ?? ""

  if (MAC_PLATFORM.test(userAgent)) return true
  if (NON_MAC_PLATFORM.test(userAgent)) return false

  // Privacy-focused browsers and command-line clients may omit platform data.
  // The landing pages currently ship macOS-only apps, so macOS is the safe
  // product-level default when the platform is genuinely unknown.
  return true
}

function redirect(location: string) {
  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "private, no-store",
      Location: location,
      Vary: "Sec-CH-UA-Platform, User-Agent",
    },
  })
}

export async function redirectToLatestRelease(
  request: Request,
  product: LandingProduct
) {
  if (!isMacRequest(request)) return redirect(product.releasesUrl)

  try {
    const response = await fetch(
      `https://api.github.com/repos/${product.releaseRepo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 900 },
      } as NextFetchInit
    )

    if (!response.ok) return redirect(product.releasesUrl)

    const release = (await response.json()) as GitHubRelease
    const assetPattern = new RegExp(product.releaseAssetPattern, "i")
    const asset = release.assets?.find(
      ({ name }) => typeof name === "string" && assetPattern.test(name)
    )
    const downloadUrl = asset?.browser_download_url
    const expectedPrefix = `https://github.com/${product.releaseRepo}/releases/download/`

    if (
      typeof downloadUrl !== "string" ||
      !downloadUrl.startsWith(expectedPrefix)
    ) {
      return redirect(product.releasesUrl)
    }

    return redirect(downloadUrl)
  } catch {
    return redirect(product.releasesUrl)
  }
}
