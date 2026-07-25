import type { LandingDistribution, LandingProduct } from "./types"

type GitHubRelease = {
  assets?: Array<{
    browser_download_url?: unknown
    name?: unknown
    size?: unknown
  }>
  tag_name?: unknown
}

export type LatestRelease = {
  downloadUrl: string
  /** Asset size in bytes, or null when GitHub omits it. */
  fileSize: number | null
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

/**
 * Unauthenticated GitHub API calls are limited to 60/hour per IP, which a
 * single serverless region exhausts quickly. A token lifts the ceiling to
 * 5,000/hour; the endpoint is public, so no token is still a working fallback.
 */
function releaseHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  const token = process.env.GITHUB_TOKEN?.trim()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function fetchLatestRelease(
  distribution: Extract<LandingDistribution, { kind: "github-release" }>,
  init: NextFetchInit
): Promise<LatestRelease | null> {
  const repo = distribution.releaseRepo

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      { ...init, headers: releaseHeaders() }
    )

    if (!response.ok) {
      console.error(
        `[landing] GitHub release lookup failed for ${repo}: ${response.status} ${response.statusText}`
      )

      return null
    }

    const release = (await response.json()) as GitHubRelease
    const assetPattern = new RegExp(distribution.releaseAssetPattern, "i")
    const asset = release.assets?.find(
      ({ name }) => typeof name === "string" && assetPattern.test(name)
    )

    if (!asset) {
      console.error(
        `[landing] No asset in the latest ${repo} release matched ${distribution.releaseAssetPattern}`
      )

      return null
    }

    const downloadUrl = asset.browser_download_url
    const expectedPrefix = `https://github.com/${repo}/releases/download/`

    if (
      typeof downloadUrl !== "string" ||
      !downloadUrl.startsWith(expectedPrefix)
    ) {
      console.error(
        `[landing] Rejected ${repo} asset URL outside ${expectedPrefix}: ${String(downloadUrl)}`
      )

      return null
    }

    const version = release.tag_name

    if (typeof version !== "string" || !version.trim()) {
      console.error(`[landing] Latest ${repo} release has no usable tag_name`)

      return null
    }

    return {
      downloadUrl,
      fileSize: typeof asset.size === "number" ? asset.size : null,
      version: version.trim(),
    }
  } catch (error) {
    console.error(`[landing] GitHub release lookup threw for ${repo}:`, error)

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

  // A short revalidate keeps every download from spending a GitHub API call
  // while still picking up a new release within a minute of publishing.
  const release = await fetchLatestRelease(product.distribution, {
    next: { revalidate: 60 },
  })

  if (!release) {
    console.error(
      `[landing] Falling back to the releases page for ${product.domain}`
    )
  }

  return redirect(release?.downloadUrl ?? product.distribution.releasesUrl)
}
