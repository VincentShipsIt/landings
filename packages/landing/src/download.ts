import type { LandingDistribution, LandingProduct } from "./types"

type GitHubRelease = {
  assets?: Array<{
    browser_download_url?: unknown
    name?: unknown
  }>
  tag_name?: unknown
}

type LatestRelease = {
  downloadUrl: string
  version: string
}

type NextFetchInit = RequestInit & {
  next?: { revalidate: number }
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

async function fetchLatestRelease(
  distribution: Extract<LandingDistribution, { kind: "github-release" }>,
  init: NextFetchInit
): Promise<LatestRelease | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${distribution.releaseRepo}/releases/latest`,
      {
        ...init,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    )

    if (!response.ok) return null

    const release = (await response.json()) as GitHubRelease
    const assetPattern = new RegExp(distribution.releaseAssetPattern, "i")
    const asset = release.assets?.find(
      ({ name }) => typeof name === "string" && assetPattern.test(name)
    )
    const downloadUrl = asset?.browser_download_url
    const expectedPrefix = `https://github.com/${distribution.releaseRepo}/releases/download/`
    const version = release.tag_name

    if (
      typeof downloadUrl !== "string" ||
      !downloadUrl.startsWith(expectedPrefix) ||
      typeof version !== "string" ||
      !version.trim()
    ) {
      return null
    }

    return { downloadUrl, version: version.trim() }
  } catch {
    return null
  }
}

export function getLatestRelease(product: LandingProduct) {
  if (product.distribution.kind !== "github-release") return null

  return fetchLatestRelease(product.distribution, {
    next: { revalidate: 300 },
  })
}

export async function redirectToLatestRelease(
  request: Request,
  product: LandingProduct
) {
  if (product.distribution.kind === "preview") {
    return redirect(product.distribution.primaryUrl)
  }

  if (product.distribution.kind === "multi-platform") {
    return redirect(product.distribution.macOS.url)
  }

  if (!isMacRequest(request)) {
    return redirect(product.distribution.releasesUrl)
  }

  const release = await fetchLatestRelease(product.distribution, {
    cache: "no-store",
  })

  return redirect(release?.downloadUrl ?? product.distribution.releasesUrl)
}
