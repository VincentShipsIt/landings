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

/** The window with the least room left in one provider. */
export function tightestWindow(provider: ProfileProvider): ProfileWindow {
  return provider.windows.reduce((tightest, window) =>
    percentLeft(window) < percentLeft(tightest) ? window : tightest
  )
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
    ? `${top.left}% left on ${top.provider.name} ${top.window.label}. AI coding limits on MeterBar.`
    : "AI coding limits on MeterBar."
}
