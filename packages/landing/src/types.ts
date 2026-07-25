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
 * Emphasis applied to a mock row. Each value maps to a complete literal class
 * string at the render site, because Tailwind only scans static strings.
 */
export type FeatureMockTone = "accent" | "neutral" | "warning"

/** One metered row: what is being measured, its readout, and its track fill. */
export type FeatureMockMeter = {
  label: string
  /** Track fill in percent. Clamped to 0–100 when rendered. */
  percent: number
  tone: FeatureMockTone
  /** Right-aligned readout, e.g. "82% used · resets in 4h". */
  value: string
}

/** One row of a state list: a subject, its supporting line, and its state. */
export type FeatureMockStatusRow = {
  detail: string
  label: string
  status: string
  tone: FeatureMockTone
}

/** One card in the tile gallery. `size` picks the column span it occupies. */
export type FeatureMockTile = {
  caption: string
  label: string
  size: "large" | "medium" | "small"
  value: string
}

/** One printed line of the terminal mock. `tone` picks its ink. */
export type FeatureMockLine = {
  text: string
  tone: "command" | "comment" | "output"
}

/** Menu bar extra opened over a panel of live meters. */
export type FeatureMenuBarMock = {
  kind: "menu-bar"
  appName: string
  footnote: string
  /** Readout rendered in the simulated menu bar item. */
  menuBarLabel: string
  meters: FeatureMockMeter[]
  panelBadge: string
  panelTitle: string
}

/** List of subjects with a state pill each. */
export type FeatureStatusMock = {
  kind: "status"
  footnote: string
  rows: FeatureMockStatusRow[]
  title: string
}

/** Terminal window printing a short, self-contained transcript. */
export type FeatureTerminalMock = {
  kind: "terminal"
  lines: FeatureMockLine[]
  title: string
}

/** Gallery of differently sized cards, e.g. a widget family. */
export type FeatureTilesMock = {
  kind: "tiles"
  footnote: string
  tiles: FeatureMockTile[]
  title: string
}

/**
 * The small interface mock paired with a feature story. Every variant is coded
 * markup rather than a screenshot, so it inherits the page theme and the
 * product accent instead of going stale next to a redesign.
 */
export type FeatureMock =
  | FeatureMenuBarMock
  | FeatureStatusMock
  | FeatureTerminalMock
  | FeatureTilesMock

/**
 * A feature promoted from a grid card to its own full-width section, pairing
 * the copy with a mock of that specific capability.
 */
export type LandingFeatureStory = {
  /** Describes the mock to assistive technology; it is not a screenshot. */
  ariaLabel: string
  description: string
  /** Short label above the title, e.g. "Menu bar". */
  eyebrow: string
  /** Supporting points listed under the description. */
  highlights: string[]
  icon: LucideIcon
  mock: FeatureMock
  title: string
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
  /**
   * Opt-in upgrade for the feature section. When set, each entry renders as its
   * own full-width section with a mock of that capability, and `features` is
   * left unused. Products that omit it keep the icon-card grid.
   */
  featureStories?: LandingFeatureStory[]
  footerNote: string
}
