import type { ProfileDocument, ProfileProvider, ProfileWindow } from "./schema"

/**
 * Presentation rules shared by the page and the card image, mirroring the app
 * (`QuotaBand`, `SocialCardPalette`) so a profile reads like the cards it is
 * shared beside.
 */

export type Band = "healthy" | "tight" | "critical" | "exhausted"

/** The icon's three stops, plus its deeper red for "out". */
export const BAND_COLOR: Record<Band, string> = {
  critical: "#f87171",
  exhausted: "#ef4444",
  healthy: "#4ade80",
  tight: "#fbbf24",
}

export const BAND_LABEL: Record<Band, string> = {
  critical: "Critical",
  exhausted: "Out",
  healthy: "Healthy",
  tight: "Tight",
}

export const PROVIDER_COLOR: Record<string, string> = {
  "Claude Code": "#d18665",
  "Codex CLI": "#64d2ff",
  Cursor: "#63d297",
  Grok: "#6caaff",
  OpenRouter: "#b19fff",
}

export const providerColor = (provider: string) =>
  PROVIDER_COLOR[provider] ?? "#9e9e9e"

export const percentLeft = (window: ProfileWindow) => 100 - window.usedPercent

export function bandFor(left: number): Band {
  if (left <= 0) return "exhausted"
  if (left <= 10) return "critical"
  if (left <= 25) return "tight"
  return "healthy"
}

// Compatibility for schema-1 uploads predating explicit availability roles.
// These are the app's routed provider-window labels, never model names.
const LEGACY_PROVIDER_LABELS = new Set([
  "Session",
  "Weekly",
  "Monthly",
  "Daily",
  "Billing cycle",
  "Quota",
  "Cursor Models",
  "Other Models",
  "Key limit",
  "Account credits",
])

const isProviderWindow = (window: ProfileWindow) =>
  window.role === "provider" ||
  (window.role === undefined && LEGACY_PROVIDER_LABELS.has(window.label))

const isOut = (window: ProfileWindow) =>
  window.usedPercent >= 100 && !window.isEstimated

function hasCursorSpillover(provider: ProfileProvider): boolean {
  return (
    provider.provider === "Cursor" &&
    provider.windows.some((window) => window.label === "Cursor Models") &&
    provider.windows.some((window) => window.label === "Other Models")
  )
}

export function blockingWindows(provider: ProfileProvider): ProfileWindow[] {
  if (provider.isBlocked === false) return []
  const windows = provider.windows.filter(isProviderWindow)
  if (hasCursorSpillover(provider) && !windows.every(isOut)) return []
  return windows.filter(isOut)
}

/** A blocked provider shows only the windows determining recovery. */
export function visibleWindows(provider: ProfileProvider): ProfileWindow[] {
  const blockers = blockingWindows(provider)
  return blockers.length ? blockers : provider.windows
}

/** The app's primary window, including Cursor spillover and model exclusions. */
export function tightestWindow(provider: ProfileProvider): ProfileWindow {
  const primary =
    provider.primaryWindowIndex === undefined
      ? undefined
      : provider.windows[provider.primaryWindowIndex]
  if (primary) return primary
  const blockers = blockingWindows(provider)
  if (blockers.length) {
    // Unknown reset data must not promise an earlier recovery.
    return (
      blockers.find((window) => !window.resetsAt) ??
      blockers.reduce((latest, window) =>
        Date.parse(window.resetsAt!) > Date.parse(latest.resetsAt!)
          ? window
          : latest
      )
    )
  }
  const candidates = provider.windows.filter(isProviderWindow)
  const windows = candidates.length ? candidates : provider.windows
  return windows.reduce((best, window) =>
    hasCursorSpillover(provider)
      ? percentLeft(window) > percentLeft(best)
        ? window
        : best
      : percentLeft(window) < percentLeft(best)
        ? window
        : best
  )
}

export const windowShowsBar = (window: ProfileWindow) => !isOut(window)

export const windowValue = (window: ProfileWindow) =>
  isOut(window)
    ? "Out of quota"
    : `${window.isEstimated ? "~" : ""}${percentLeft(window)}% left`

export function windowDetails(window: ProfileWindow, now = Date.now()): string {
  const reset = window.resetsAt ? Date.parse(window.resetsAt) : null
  const resetText =
    reset !== null && reset > now
      ? `resets ${new Date(reset).toUTCString().replace(" GMT", " UTC")}`
      : reset !== null && now - reset <= 5 * 60 * 1000
        ? "reset due now"
        : null
  return [
    isOut(window) ? null : window.pace,
    resetText,
    isOut(window) && !resetText ? "reset unavailable" : null,
  ]
    .filter(Boolean)
    .join(" · ")
}

export type Headline = {
  provider: ProfileProvider
  window: ProfileWindow
  left: number
  band: Band
}

/** The single tightest window across every provider: the card's hero. */
export function headline(document: ProfileDocument): Headline | null {
  let best: Headline | null = null
  for (const provider of document.providers) {
    const window = tightestWindow(provider)
    const left = percentLeft(window)
    if (!best || left < best.left) {
      best = { band: bandFor(left), left, provider, window }
    }
  }
  return best
}

export function formatTokens(value: number): string {
  if (value >= 1e9) return `${trim(value / 1e9)}B`
  if (value >= 1e6) return `${trim(value / 1e6)}M`
  if (value >= 1e3) return `${trim(value / 1e3)}K`
  return String(value)
}

const trim = (n: number) =>
  (n >= 100 ? n.toFixed(0) : n.toFixed(1)).replace(/\.0$/, "")

export function relativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000))
  if (seconds < 90) return "just now"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} hr ago`
  return `${Math.round(hours / 24)} days ago`
}

export function cardAlt(document: ProfileDocument): string {
  const top = headline(document)
  return top
    ? `${top.window.isEstimated ? "~" : ""}${top.left}% left on ${top.provider.name} ${top.window.label}. AI coding limits on MeterBar.`
    : "AI coding limits on MeterBar."
}
