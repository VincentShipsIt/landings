import {
  Activity,
  Boxes,
  Gauge,
  HardDrive,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Terminal,
} from "lucide-react"

import type { LandingProduct } from "./types"

export const meterBarLanding: LandingProduct = {
  name: "MeterBar",
  domain: "meterbar.dev",
  repoUrl: "https://github.com/VincentShipsIt/meterbar.app",
  downloadUrl: "/download",
  releasesUrl: "https://github.com/VincentShipsIt/meterbar.app/releases",
  releaseRepo: "VincentShipsIt/meterbar.app",
  releaseAssetPattern: String.raw`^MeterBar-v[\d.]+\.zip$`,
  installCommand: "brew install --cask vincentshipsit/tap/meterbar",
  agentPrompt:
    "Install MeterBar on my Mac: run `brew install --cask vincentshipsit/tap/meterbar`, verify the app is signed and notarized with `spctl -a -t exec /Applications/MeterBar.app`, then launch it.",
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
    logo: "/product/logo.png",
    primaryImage: "/product/menubar.png",
    secondaryImage: "/product/widget-medium.png",
    primaryAlt: "MeterBar menu bar popover showing AI provider usage limits",
    secondaryAlt: "MeterBar macOS widget showing quota usage",
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
  installNotes: [
    "macOS 26+ target while the app is under active development.",
    "Reads from CLI/provider state already on the machine.",
    "Signed and notarized; no Gatekeeper overrides needed.",
  ],
  footerNote:
    "Built by VincentShipsIt. Free, open source, no upsells.",
}

export const macSweepLanding: LandingProduct = {
  name: "MacSweep",
  domain: "macsweep.dev",
  repoUrl: "https://github.com/VincentShipsIt/macsweep",
  downloadUrl: "/download",
  releasesUrl: "https://github.com/VincentShipsIt/macsweep/releases",
  releaseRepo: "VincentShipsIt/macsweep",
  releaseAssetPattern: String.raw`^macsweep-v[\d.]+-macos\.zip$`,
  installCommand: "brew install --cask vincentshipsit/tap/macsweep",
  agentPrompt:
    "Install MacSweep on my Mac: run `brew install --cask vincentshipsit/tap/macsweep`, verify the app is signed and notarized with `spctl -a -t exec /Applications/MacSweep.app`, then launch it.",
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
    logo: "/product/logo.png",
    primaryImage: "/product/maintenance.png",
    secondaryImage: "/product/space-lens.png",
    tertiaryImage: "/product/developer-tools.png",
    primaryAlt: "MacSweep one-click maintenance actions",
    secondaryAlt: "MacSweep Space Lens disk visualization",
    tertiaryAlt: "MacSweep developer tools cleanup screen",
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
  installNotes: [
    "macOS 26+ target while the app is under active development.",
    "Homebrew cask installs the SwiftUI app and CLI.",
    "Dry-run first when using the CLI on a new machine.",
  ],
  footerNote:
    "Built by VincentShipsIt. Open-source utility, no fake scareware energy.",
}
