import { Activity, Boxes, Gauge, LockKeyhole } from "lucide-react"

import type { LandingProduct } from "../types"
import { OG_CARD_DIMENSIONS, RELEASE_COPY } from "./shared"

export const meterBarLanding: LandingProduct = {
  name: "MeterBar",
  domain: "meterbar.dev",
  repoUrl: "https://github.com/VincentShipsIt/meterbar.dev",
  distribution: {
    kind: "github-release",
    primaryUrl: "/download",
    releasesUrl: "https://github.com/VincentShipsIt/meterbar.dev/releases",
    releaseRepo: "VincentShipsIt/meterbar.dev",
    releaseAssetPattern: String.raw`^MeterBar-v[\d.]+\.zip$`,
    installCommand: "brew install --cask vincentshipsit/tap/meterbar",
    agentPrompt:
      "Install MeterBar on my Mac: run `brew install --cask vincentshipsit/tap/meterbar`, verify the app is signed and notarized with `spctl -a -t exec /Applications/MeterBar.app`, then launch it.",
    copy: RELEASE_COPY,
    notes: [
      "macOS 26+ target while the app is under active development.",
      "Reads from CLI/provider state already on the machine.",
      "Signed and notarized; no Gatekeeper overrides needed.",
    ],
  },
  xUrl: "https://x.com/VincentShipsIt",
  accent: "oklch(0.67 0.18 150)",
  accentSoft: "oklch(0.94 0.05 150)",
  title: "Know your limits before you hit them.",
  description:
    "Open-source macOS menu bar telemetry for Claude Code, Codex CLI, and Cursor usage limits.",
  metaDescription:
    "MeterBar is an open-source macOS menu bar app for tracking Claude Code, Codex CLI, and Cursor usage limits locally.",
  heroCopy:
    "A tiny native utility for people who burn through AI coding quotas. It reads local provider state, shows the tightest limit in your menu bar, and keeps the source open.",
  primaryCta: "Download for macOS",
  secondaryCta: "View source",
  platformRequirement: "Requires macOS 26 or later",
  ogImage: {
    ...OG_CARD_DIMENSIONS,
    alt: "MeterBar — Know your limits.",
    src: "/og-card.png",
  },
  visual: {
    kind: "screenshots",
    logo: {
      alt: "",
      height: 512,
      src: "/product/logo.png",
      width: 512,
    },
    primary: {
      alt: "MeterBar overview window tracking Codex, Claude, and Cursor usage limits",
      height: 700,
      src: "/product/overview.png",
      width: 1040,
    },
    gallery: [
      {
        alt: "MeterBar macOS widget showing quota usage",
        height: 436,
        src: "/product/widget-medium.png",
        width: 776,
      },
    ],
  },
  sections: {
    featureHeading: "A quota meter that stays out of the way.",
    featureDescription:
      "MeterBar reads the provider state already on your Mac, surfaces the limit closest to running out, and stays quiet the rest of the time.",
    galleryHeading: "Inside MeterBar",
    availabilityLabel: "Install",
    availabilityHeading: "Download it, or install it with Homebrew.",
    availabilityDescription:
      "Signed and notarized, so it opens on the first try — no Gatekeeper detour. The full source is on GitHub if you would rather build it yourself.",
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
        "Credentials stay on the Mac. Nothing is uploaded, and no account is ever created.",
      icon: LockKeyhole,
    },
  ],
  footerNote: "Built by VincentShipsIt. Free, open source, no upsells.",
}
