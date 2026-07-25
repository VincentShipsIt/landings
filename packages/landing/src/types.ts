import type { LucideIcon } from "lucide-react"

/**
 * Bitmap asset rendered through next/image. Intrinsic dimensions are required
 * so the browser reserves space before the image loads.
 */
export type LandingImage = {
  alt: string
  height: number
  src: string
  width: number
}

/** Copy for the direct-download card. Shared shape across GitHub-released apps. */
export type ReleaseCopy = {
  agentButtonLabel: string
  agentLabel: string
  allReleasesLabel: string
  cardDescription: string
  cardLabel: string
  homebrewLabel: string
  sourceLabel: string
}

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
      copy: ReleaseCopy
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
      /**
       * Same-origin CTA target. The matching `/download` route resolves it to
       * `macOS.url`, which must stay absolute so the redirect cannot loop.
       */
      primaryUrl: string
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
  logo: LandingImage
  primary: LandingImage
  gallery: LandingImage[]
}

type InterfacePreviewVisual = {
  kind: "interface-preview"
  /** Letter(s) rendered in the generated product mark. */
  markLabel: string
  /** Describes the mock to assistive technology; it is not a screenshot. */
  ariaLabel: string
  caption: string
  previewLabel: string
  previewEyebrow: string
  previewTitle: string
  previewAction: string
  composerPlaceholder: string
  composerAction: string
  navItems: Array<{
    icon: LucideIcon
    label: string
    selected?: boolean
  }>
  previewItems: Array<{
    detail: string
    title: string
  }>
}

/** Tone applied to a usage meter, driven by how much quota is left. */
export type MenuBarWindowState = "critical" | "healthy" | "tight"

type MenuBarPreviewVisual = {
  kind: "menubar-preview"
  /** Real logo, still used for the header and footer product mark. */
  logo: LandingImage
  /** Describes the mock to assistive technology; it is not a screenshot. */
  ariaLabel: string
  caption: string
  /** Text shown in the faux macOS menu bar's clock slot. */
  menuBarClock: string
  /** Compact status the app itself paints into the menu bar, e.g. "17%". */
  menuBarStatus: string
  accountName: string
  accountPlan: string
  updatedLabel: string
  windows: Array<{
    label: string
    /** Percentage of quota remaining, 0-100. Drives bar width and tone. */
    remaining: number
    state: MenuBarWindowState
    resetLabel: string
    note?: string
  }>
  stats: Array<{ label: string; value: string }>
  /** Real screenshots, still rendered in the gallery below the fold. */
  gallery: LandingImage[]
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
  /** Shown next to the primary CTA so the OS floor is visible above the fold. */
  platformRequirement: string
  ogImage: LandingImage
  visual: ScreenshotVisual | InterfacePreviewVisual | MenuBarPreviewVisual
  /**
   * Coverage strip listing the tools the app reads. Omitted for products that
   * do not integrate with anything.
   */
  providers?: {
    heading: string
    description: string
    items: Array<{ name: string; detail: string }>
  }
  sections: {
    featureHeading: string
    featureDescription: string
    galleryHeading: string
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
