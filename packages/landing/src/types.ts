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

/** Tone applied to a usage meter, driven by how much quota is left. */
export type MenuBarWindowState = "critical" | "healthy" | "tight"

type MenuBarStat = { label: string; value: string }

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
  /**
   * Exactly three, pinned to the footer's fixed three-column grid. Any other
   * count would wrap into an orphaned cell, which the grid's hairline gaps
   * render as stray borders rather than an obvious layout mistake.
   */
  stats: [MenuBarStat, MenuBarStat, MenuBarStat]
  /** Real screenshots, still rendered in the gallery below the fold. */
  gallery: LandingImage[]
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
  /**
   * Opt-in upgrade for the feature section. When set, each entry renders as its
   * own full-width section with a mock of that capability, and `features` is
   * left unused. Products that omit it keep the icon-card grid.
   */
  featureStories?: LandingFeatureStory[]
  /** Rendered between the features and the gallery when set. */
  privacy?: LandingPrivacy
  footerNote: string
}
