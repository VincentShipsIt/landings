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

/**
 * Trust section for products whose core job is reading local credential or
 * provider state, where a generic "nothing is uploaded" line is the weakest
 * possible answer. Optional: products that omit it render exactly as before.
 *
 * Every string here is a factual claim about the shipped app, so it must be
 * checkable against that app's own source before it goes in.
 */
export type LandingPrivacy = {
  description: string
  /** Short, verifiable claims that need no per-item source path. */
  guarantees: string[]
  guaranteesHeading: string
  heading: string
  /** Eyebrow above the heading, e.g. "Privacy". */
  label: string
  /** macOS prompts the user should expect, each with the reason it appears. */
  permissions: Array<{
    detail: string
    title: string
  }>
  permissionsHeading: string
  /** One entry per local source the app reads, and what it takes from it. */
  reads: Array<{
    detail: string
    /** Literal path or store, rendered as code. */
    source: string
    title: string
  }>
  /** Where a reader can check all of the above against the source. */
  sourceLink: {
    href: string
    label: string
  }
}

export type LandingProduct = {
  name: string
  domain: string
  repoUrl: string
  distribution: LandingDistribution
  /** X (Twitter) profile URL, linked in the footer when set. */
  xUrl?: string
  title: string
  description: string
  metaDescription: string
  heroCopy: string
  primaryCta: string
  secondaryCta: string
  /** Shown next to the primary CTA so the OS floor is visible above the fold. */
  platformRequirement: string
  ogImage: LandingImage
  visual: ScreenshotVisual | InterfacePreviewVisual
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
  /** Rendered between the features and the gallery when set. */
  privacy?: LandingPrivacy
  footerNote: string
}
