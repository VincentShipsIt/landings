import type { LucideIcon } from "lucide-react"

export type LandingDistribution =
  | {
      kind: "github-release"
      primaryUrl: string
      releasesUrl: string
      /** GitHub repository used to resolve the latest versioned release artifact. */
      releaseRepo: string
      /** Case-insensitive pattern identifying the supported macOS ZIP asset. */
      releaseAssetPattern: string
      installCommand: string
      /** Copyable instruction for coding agents (Claude Code, Codex) to install the app. */
      agentPrompt: string
      notes: string[]
    }
  | {
      kind: "preview"
      primaryUrl: string
      statusLabel: string
      cardTitle: string
      cardDescription: string
      primaryActionLabel: string
      primaryActionUrl: string
      secondaryActionLabel: string
      secondaryActionUrl: string
      notes: string[]
    }
  | {
      kind: "multi-platform"
      macOS: {
        actionLabel: string
        description: string
        statusLabel: string
        url: string
      }
      iOS: {
        actionLabel: string
        description: string
        statusLabel: string
        url: string | null
      }
      notes: string[]
    }

type ScreenshotVisual = {
  kind: "screenshots"
  logo: string
  primaryImage: string
  secondaryImage: string
  tertiaryImage?: string
  primaryAlt: string
  secondaryAlt: string
  tertiaryAlt?: string
}

type InterfacePreviewVisual = {
  kind: "interface-preview"
  previewLabel: string
  previewTitle: string
  previewItems: Array<{
    detail: string
    title: string
  }>
}

export type LandingProduct = {
  name: string
  domain: string
  repoUrl: string
  distribution: LandingDistribution
  /** X (Twitter) profile URL, linked in the footer when set. */
  xUrl?: string
  accent: string
  accentSoft: string
  title: string
  description: string
  metaDescription: string
  heroCopy: string
  primaryCta: string
  secondaryCta: string
  visual: ScreenshotVisual | InterfacePreviewVisual
  sections: {
    featureHeading: string
    featureDescription: string
    availabilityLabel: string
    availabilityHeading: string
    availabilityDescription: string
  }
  proof: string[]
  features: Array<{
    title: string
    description: string
    icon: LucideIcon
  }>
  footerNote: string
}
