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
  downloadUrl: "https://github.com/VincentShipsIt/meterbar.app/releases",
  installCommand:
    "brew tap VincentShipsIt/tap && brew install --cask VincentShipsIt/tap/meterbar",
  accent: "oklch(0.67 0.18 150)",
  accentSoft: "oklch(0.94 0.05 150)",
  title: "MeterBar",
  description:
    "Open-source macOS menu bar telemetry for Claude Code, Codex CLI, and Cursor usage limits.",
  metaDescription:
    "MeterBar is an open-source macOS menu bar app for tracking Claude Code, Codex CLI, and Cursor usage limits locally.",
  heroCopy:
    "A tiny native utility for people who burn through AI coding quotas. It reads local provider state, shows the tightest limit in your menu bar, and keeps the source open.",
  primaryCta: "Download",
  secondaryCta: "View source",
  visual: {
    logo: "/product/logo.svg",
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
    "Unsigned builds may need the usual first-launch quarantine bypass until Developer ID is finished.",
  ],
  footerNote:
    "Built by VincentShipsIt. Free, open source, and intentionally boring.",
}

export const macSweepLanding: LandingProduct = {
  name: "MacSweep",
  domain: "macsweep.dev",
  repoUrl: "https://github.com/VincentShipsIt/macsweep",
  downloadUrl: "https://github.com/VincentShipsIt/macsweep/releases",
  installCommand:
    "brew tap vincentshipsit/tap && brew install --cask vincentshipsit/tap/macsweep",
  accent: "oklch(0.68 0.16 210)",
  accentSoft: "oklch(0.94 0.05 210)",
  title: "MacSweep",
  description:
    "Open-source macOS cleanup, inspection, and maintenance tools with safety-first defaults.",
  metaDescription:
    "MacSweep is an open-source native macOS cleaner and CLI for scanning, inspecting, and cleaning developer and system clutter safely.",
  heroCopy:
    "A native cleaner for developers who want to see exactly what will be removed before anything is touched. Scan first, clean intentionally, keep the code public.",
  primaryCta: "Download",
  secondaryCta: "View source",
  visual: {
    logo: "/product/logo.svg",
    primaryImage: "/product/smart-care.png",
    secondaryImage: "/product/space-lens.png",
    tertiaryImage: "/product/developer-tools.png",
    primaryAlt: "MacSweep Smart Care screen",
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
