import {
  Activity,
  Boxes,
  BrainCircuit,
  CalendarCheck,
  Cloud,
  CloudCog,
  Gauge,
  HardDrive,
  History,
  ListChecks,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Terminal,
  UsersRound,
  Zap,
} from "lucide-react"

import type { LandingProduct } from "./types"

export const meterBarLanding: LandingProduct = {
  name: "MeterBar",
  domain: "meterbar.dev",
  repoUrl: "https://github.com/VincentShipsIt/meterbar.app",
  distribution: {
    kind: "github-release",
    primaryUrl: "/download",
    releasesUrl: "https://github.com/VincentShipsIt/meterbar.app/releases",
    releaseRepo: "VincentShipsIt/meterbar.app",
    releaseAssetPattern: String.raw`^MeterBar-v[\d.]+\.zip$`,
    installCommand: "brew install --cask vincentshipsit/tap/meterbar",
    agentPrompt:
      "Install MeterBar on my Mac: run `brew install --cask vincentshipsit/tap/meterbar`, verify the app is signed and notarized with `spctl -a -t exec /Applications/MeterBar.app`, then launch it.",
    notes: [
      "macOS 26+ target while the app is under active development.",
      "Reads from CLI/provider state already on the machine.",
      "Signed and notarized; no Gatekeeper overrides needed.",
    ],
  },
  xUrl: "https://x.com/VincentShipsIt",
  accent: "oklch(0.67 0.18 150)",
  accentSoft: "oklch(0.94 0.05 150)",
  title: "MeterBar",
  description:
    "Open-source macOS menu bar telemetry for Claude Code, Codex CLI, and Cursor usage limits.",
  metaDescription:
    "MeterBar is an open-source macOS menu bar app for tracking Claude Code, Codex CLI, and Cursor usage limits locally.",
  heroCopy:
    "A tiny native utility for people who burn through AI coding quotas. It reads local provider state, shows the tightest limit in your menu bar, and keeps the source open.",
  primaryCta: "Download for macOS",
  secondaryCta: "View source",
  visual: {
    kind: "screenshots",
    logo: "/product/logo.png",
    primaryImage: "/product/overview.png",
    secondaryImage: "/product/widget-medium.png",
    primaryAlt:
      "MeterBar overview window tracking Codex, Claude, and Cursor usage limits",
    secondaryAlt: "MeterBar macOS widget showing quota usage",
  },
  sections: {
    featureHeading: "Built like a utility, distributed like open source.",
    featureDescription:
      "The page is intentionally straightforward: show the product, link the source, and make installation obvious.",
    availabilityLabel: "Install",
    availabilityHeading: "Install from the repo. Fork if useful.",
    availabilityDescription:
      "These are distribution pages, not a funnel. The app stays useful as proof of taste, shipping cadence, and open-source surface area.",
  },
  proof: ["MIT licensed", "Local-first", "No account required"],
  features: [
    {
      title: "Menu bar signal",
      description:
        "The tightest quota is always visible without opening dashboards or provider pages.",
      icon: Activity,
    },
    {
      title: "Native widgets",
      description:
        "Small, medium, and large widgets keep the same provider state visible in Notification Center.",
      icon: Gauge,
    },
    {
      title: "Provider aware",
      description:
        "Tracks Claude Code, Codex CLI, and Cursor from their local auth and usage surfaces.",
      icon: Boxes,
    },
    {
      title: "Private by default",
      description:
        "Credentials stay on the Mac. The landing page exists to point people at the source and releases.",
      icon: LockKeyhole,
    },
  ],
  footerNote: "Built by VincentShipsIt. Free, open source, no upsells.",
}

export const macSweepLanding: LandingProduct = {
  name: "MacSweep",
  domain: "macsweep.dev",
  repoUrl: "https://github.com/VincentShipsIt/macsweep",
  distribution: {
    kind: "github-release",
    primaryUrl: "/download",
    releasesUrl: "https://github.com/VincentShipsIt/macsweep/releases",
    releaseRepo: "VincentShipsIt/macsweep",
    releaseAssetPattern: String.raw`^macsweep-v[\d.]+-macos\.zip$`,
    installCommand: "brew install --cask vincentshipsit/tap/macsweep",
    agentPrompt:
      "Install MacSweep on my Mac: run `brew install --cask vincentshipsit/tap/macsweep`, verify the app is signed and notarized with `spctl -a -t exec /Applications/MacSweep.app`, then launch it.",
    notes: [
      "macOS 26+ target while the app is under active development.",
      "Homebrew cask installs the SwiftUI app and CLI.",
      "Dry-run first when using the CLI on a new machine.",
    ],
  },
  xUrl: "https://x.com/VincentShipsIt",
  accent: "oklch(0.68 0.16 210)",
  accentSoft: "oklch(0.94 0.05 210)",
  title: "MacSweep",
  description:
    "Open-source macOS cleanup, inspection, and maintenance tools with safety-first defaults.",
  metaDescription:
    "MacSweep is an open-source native macOS cleaner and CLI for scanning, inspecting, and cleaning developer and system clutter safely.",
  heroCopy:
    "A native cleaner for developers who want to see exactly what will be removed before anything is touched. Scan first, clean intentionally, keep the code public.",
  primaryCta: "Download for macOS",
  secondaryCta: "View source",
  visual: {
    kind: "screenshots",
    logo: "/product/logo.png",
    primaryImage: "/product/smart-care.png",
    secondaryImage: "/product/system-junk.png",
    tertiaryImage: "/product/developer-tools.png",
    primaryAlt:
      "MacSweep Smart Care scan results with cleanup categories and reclaimable space",
    secondaryAlt: "MacSweep System Junk scan listing caches with sizes",
    tertiaryAlt: "MacSweep package manager cache cleanup",
  },
  sections: {
    featureHeading: "Built like a utility, distributed like open source.",
    featureDescription:
      "The page is intentionally straightforward: show the product, link the source, and make installation obvious.",
    availabilityLabel: "Install",
    availabilityHeading: "Install from the repo. Fork if useful.",
    availabilityDescription:
      "These are distribution pages, not a funnel. The app stays useful as proof of taste, shipping cadence, and open-source surface area.",
  },
  proof: ["MIT licensed", "Safety checks", "CLI + SwiftUI app"],
  features: [
    {
      title: "Scan before cleanup",
      description:
        "Reports what is reclaimable before destructive work happens.",
      icon: Radar,
    },
    {
      title: "Developer clutter",
      description:
        "Find node_modules, DerivedData, Docker data, package caches, and other heavy artifacts.",
      icon: Terminal,
    },
    {
      title: "Safe removal paths",
      description:
        "Protection rules keep credentials, keychains, and sensitive folders out of cleanup flows.",
      icon: ShieldCheck,
    },
    {
      title: "Visual disk context",
      description:
        "Space Lens, large files, duplicates, and app leftovers make cleanup decisions inspectable.",
      icon: HardDrive,
    },
  ],
  footerNote:
    "Built by VincentShipsIt. Open-source utility, no fake scareware energy.",
}

export const openTVTrackerLanding: LandingProduct = {
  name: "OpenTV Tracker",
  domain: "opentvtracker.dev",
  repoUrl: "https://github.com/VincentShipsIt/opentvtracker",
  distribution: {
    kind: "preview",
    primaryUrl: "#availability",
    statusLabel: "TestFlight setup in progress",
    cardTitle: "A private iPhone beta comes first.",
    cardDescription:
      "OpenTV Tracker is not on the App Store yet. The signed iOS build and two-device CloudKit verification are the final gates before TestFlight invitations open.",
    primaryActionLabel: "Follow TestFlight progress",
    primaryActionUrl:
      "https://github.com/VincentShipsIt/opentvtracker/issues/46",
    secondaryActionLabel: "Read the roadmap",
    secondaryActionUrl:
      "https://github.com/VincentShipsIt/opentvtracker/blob/main/docs/ROADMAP.md",
    notes: [
      "Requires iOS 26 or later for the full Liquid Glass experience.",
      "No OpenTV account is required; your personal library stays on your iPhone.",
      "Partner sharing uses an invitation-only CloudKit space.",
    ],
  },
  xUrl: "https://x.com/VincentShipsIt",
  accent: "oklch(0.67 0.17 255)",
  accentSoft: "oklch(0.93 0.07 255)",
  title: "Keep the shows. Lose the feed.",
  description:
    "A privacy-minded iPhone tracker for TV shows and movies, built for one person or two.",
  metaDescription:
    "OpenTV Tracker is an open-source, privacy-minded iPhone app for TV and movie tracking, partner progress, explainable recommendations, and portable history.",
  heroCopy:
    "Track every episode, finish whole seasons in a tap, and keep a shared queue with your partner. Your history stays useful, portable, and yours.",
  primaryCta: "TestFlight coming soon",
  secondaryCta: "View source",
  visual: {
    kind: "screenshots",
    logo: "/product/logo.png",
    primaryImage: "/product/up-next.png",
    secondaryImage: "/product/discover.png",
    tertiaryImage: "/product/recommendations.png",
    primaryAlt:
      "OpenTV Tracker Up Next screen showing Ghosts episode progress and artwork",
    secondaryAlt:
      "OpenTV Tracker artwork-led discovery categories and recommendation assistant",
    tertiaryAlt:
      "OpenTV Tracker recommendations based on selected streaming services",
  },
  sections: {
    featureHeading: "A watch history that works for you.",
    featureDescription:
      "OpenTV combines quick progress controls, private partner sharing, and recommendations that can explain why a title fits.",
    availabilityLabel: "Availability",
    availabilityHeading: "TestFlight before the App Store.",
    availabilityDescription:
      "The app is in release setup now. The beta stays small until signing, production CloudKit, and real two-iPhone sharing have been verified end to end.",
  },
  proof: ["iOS 26+", "Private by default", "MIT licensed"],
  features: [
    {
      title: "Solo or together",
      description:
        "Keep a personal library or share selected titles and progress in one invitation-only CloudKit space.",
      icon: UsersRound,
    },
    {
      title: "Precise progress",
      description:
        "Mark one episode, every earlier episode in a season, or the full season watched without repetitive taps.",
      icon: ListChecks,
    },
    {
      title: "Recommendations with reasons",
      description:
        "On-device ranking learns from your history; optional user-controlled AI can rerank the same bounded candidates.",
      icon: BrainCircuit,
    },
    {
      title: "History you own",
      description:
        "Import a TV Time export, then keep a portable versioned history you can export again as JSON or CSV.",
      icon: History,
    },
    {
      title: "Local first",
      description:
        "Tracking works offline with no OpenTV account. Personal ratings, notes, and watch history stay on the iPhone.",
      icon: Smartphone,
    },
    {
      title: "Private partner sync",
      description:
        "CloudKit shares only the titles and activity you choose for Together—not the rest of either personal library.",
      icon: Cloud,
    },
  ],
  footerNote:
    "Built by VincentShipsIt. Open source, private by default, no public activity feed.",
}

export const openFocusLanding: LandingProduct = {
  name: "OpenFocus",
  domain: "openfocus.dev",
  repoUrl: "https://github.com/VincentShipsIt/openfocusdev",
  distribution: {
    kind: "multi-platform",
    primaryUrl:
      "https://github.com/VincentShipsIt/openfocusdev/releases/latest",
    macOS: {
      actionLabel: "Download for macOS",
      description:
        "The native Mac build will be published through GitHub Releases. Until the first release lands, this link stays on the canonical latest-release page.",
      statusLabel: "Pre-alpha",
      url: "https://github.com/VincentShipsIt/openfocusdev/releases/latest",
    },
    iOS: {
      actionLabel: "iPhone coming soon",
      description:
        "The iPhone build has a TestFlight delivery workflow, but there is no public TestFlight or App Store link yet.",
      statusLabel: "TestFlight link pending",
      url: null,
    },
    notes: [
      "Requires macOS 26 or iOS 26 for the full Liquid Glass experience.",
      "Tasks persist locally with SwiftData; private iCloud sync is prepared for release configuration.",
      "The planning agent is wired for a user-provided AI key.",
    ],
  },
  xUrl: "https://x.com/VincentShipsIt",
  accent: "oklch(0.67 0.17 282)",
  accentSoft: "oklch(0.93 0.07 282)",
  title: "Your day, already in focus.",
  description: "A fast, native, AI-native task manager for Mac and iPhone.",
  metaDescription:
    "OpenFocus is a fast, open-source SwiftUI task manager for Mac and iPhone with Liquid Glass, local-first SwiftData, private iCloud sync readiness, and an AI day-planning agent.",
  heroCopy:
    "Capture work at native speed, keep it local, and let a planning agent turn today’s tasks into an ordered plan. One SwiftUI codebase, built for Mac and iPhone.",
  primaryCta: "Download for macOS",
  secondaryCta: "iPhone coming soon",
  visual: {
    kind: "interface-preview",
    previewLabel: "Source-grounded interface preview",
    previewTitle: "Today",
    previewItems: [
      {
        title: "Review launch checklist",
        detail: "Today · Launch",
      },
      {
        title: "Prepare the weekly plan",
        detail: "Today · Planning",
      },
      {
        title: "Clear the inbox",
        detail: "Today · Personal",
      },
    ],
  },
  sections: {
    featureHeading: "Native where speed and privacy matter.",
    featureDescription:
      "OpenFocus keeps the task engine, persistence, and interface in Swift. No Electron shell, no account server, and no waiting for a web view to catch up.",
    availabilityLabel: "Download",
    availabilityHeading: "One task system. Two Apple-native surfaces.",
    availabilityDescription:
      "The Mac and iPhone apps share the same engine. Distribution is still pre-alpha: macOS releases will ship on GitHub, while the public iPhone beta link is not available yet.",
  },
  proof: ["macOS + iOS 26", "Local-first", "MIT licensed"],
  features: [
    {
      title: "Instant native capture",
      description:
        "SwiftUI views and a shared Swift engine keep quick add, navigation, and task updates immediate.",
      icon: Zap,
    },
    {
      title: "Liquid Glass",
      description:
        "Native sidebars, toolbars, tab bars, and quick-add chrome adopt the Apple platform material.",
      icon: Sparkles,
    },
    {
      title: "Plan my day",
      description:
        "An AI agent reads today’s tasks and proposes an ordered, time-blocked plan you can review.",
      icon: CalendarCheck,
    },
    {
      title: "Local-first SwiftData",
      description:
        "Every write lands locally first, so task capture keeps working offline and without an OpenFocus account.",
      icon: ListChecks,
    },
    {
      title: "Private iCloud sync",
      description:
        "The CloudKit-ready store is designed to sync your Mac and iPhone through your own private iCloud.",
      icon: CloudCog,
    },
    {
      title: "Open by default",
      description:
        "The app, CLI, task engine, and delivery workflows are public under the MIT license.",
      icon: ShieldCheck,
    },
  ],
  footerNote: "Built by VincentShipsIt. Native, open source, and local-first.",
}
