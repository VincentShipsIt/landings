import {
  CalendarCheck,
  CalendarClock,
  CloudCog,
  Folder,
  Inbox,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

import type { LandingProduct } from "../types"
import { OG_CARD_DIMENSIONS, SUBSCRIBE_PLACEHOLDER } from "./shared"

export const openFocusLanding: LandingProduct = {
  name: "OpenFocus",
  domain: "openfocus.dev",
  repoUrl: "https://github.com/VincentShipsIt/openfocusdev",
  distribution: {
    kind: "multi-platform",
    // Same-origin so the Mac CTA resolves the newest versioned asset through
    // the shared `/download` route; `macOS.url` stays absolute as its target.
    primaryUrl: "/download",
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
  platformRequirement: "Requires macOS 26 or iOS 26",
  ogImage: {
    ...OG_CARD_DIMENSIONS,
    alt: "OpenFocus — your day, already in focus.",
    src: "/opengraph-image",
  },
  visual: {
    kind: "interface-preview",
    markLabel: "O",
    ariaLabel:
      "Stylized OpenFocus interface preview based on the current source code, not a product screenshot",
    caption:
      "Interface treatment based on the public SwiftUI source. Not a product screenshot.",
    previewLabel: "Source-grounded interface preview",
    previewEyebrow: "Thursday",
    previewTitle: "Today",
    previewAction: "Plan my day",
    composerPlaceholder: "Add a task… try “report fri 5pm !!”",
    composerAction: "Add",
    navItems: [
      { icon: ListChecks, label: "Today", selected: true },
      { icon: CalendarClock, label: "Upcoming" },
      { icon: Inbox, label: "Inbox" },
      { icon: Folder, label: "Projects" },
    ],
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
    galleryHeading: "Inside OpenFocus",
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
  subscribe: {
    buttonLabel: "Notify me",
    description:
      "One email when the first macOS release and the iPhone beta go live.",
    fallbackLabel: "Or watch the repository on GitHub",
    fallbackUrl: "https://github.com/VincentShipsIt/openfocusdev",
    heading: "Get the first release",
    placeholder: SUBSCRIBE_PLACEHOLDER,
    successMessage: "You are on the list. Watch for the first release.",
  },
  footerNote: "Built by VincentShipsIt. Native, open source, and local-first.",
}
