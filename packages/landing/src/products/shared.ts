import type { ReleaseCopy } from "../types"

/**
 * The direct-download card reads identically on every app shipped through
 * GitHub Releases, so the labels live here instead of in each product config.
 */
export const RELEASE_COPY: ReleaseCopy = {
  agentButtonLabel: "Copy prompt for your agent",
  agentLabel: "Using Claude Code or Codex?",
  allReleasesLabel: "All releases",
  cardDescription: "Signed and notarized. Drag to Applications, done.",
  cardLabel: "Direct download",
  homebrewLabel: "Prefer Homebrew?",
  sourceLabel: "GitHub",
}

/** Placeholder shared by every launch-notification form. */
export const SUBSCRIBE_PLACEHOLDER = "you@example.com"

export const OG_CARD_DIMENSIONS = { height: 630, width: 1200 }
