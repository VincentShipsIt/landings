import { HardDrive, Radar, ShieldCheck, Terminal } from "lucide-react"

import type { LandingProduct } from "../types"
import { OG_CARD_DIMENSIONS, RELEASE_COPY } from "./shared"

export const macSweepLanding: LandingProduct = {
  name: "MacSweep",
  domain: "macsweep.dev",
  repoUrl: "https://github.com/VincentShipsIt/macsweep.dev",
  distribution: {
    kind: "github-release",
    primaryUrl: "/download",
    releasesUrl: "https://github.com/VincentShipsIt/macsweep.dev/releases",
    releaseRepo: "VincentShipsIt/macsweep.dev",
    releaseAssetPattern: String.raw`^macsweep-v[\d.]+-macos\.zip$`,
    installCommand: "brew install --cask vincentshipsit/tap/macsweep",
    agentPrompt:
      "Install MacSweep on my Mac: run `brew install --cask vincentshipsit/tap/macsweep`, verify the app is signed and notarized with `spctl -a -t exec /Applications/MacSweep.app`, then launch it.",
    copy: RELEASE_COPY,
    notes: [
      "macOS 26+ target while the app is under active development.",
      "Homebrew cask installs the SwiftUI app and CLI.",
      "Dry-run first when using the CLI on a new machine.",
    ],
  },
  xUrl: "https://x.com/VincentShipsIt",
  title: "Clean your Mac. Keep control.",
  description:
    "Open-source macOS cleanup, inspection, and maintenance tools with safety-first defaults.",
  metaDescription:
    "MacSweep is an open-source native macOS cleaner and CLI for scanning, inspecting, and cleaning developer and system clutter safely.",
  heroCopy:
    "A native cleaner for developers who want to see exactly what will be removed before anything is touched. Scan first, clean intentionally, keep the code public.",
  primaryCta: "Download for macOS",
  secondaryCta: "View source",
  platformRequirement: "Requires macOS 26 or later",
  ogImage: {
    ...OG_CARD_DIMENSIONS,
    alt: "MacSweep — Clean your Mac. Keep control.",
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
      alt: "MacSweep Smart Care scan results with cleanup categories and reclaimable space",
      height: 1125,
      src: "/product/smart-care.png",
      width: 1341,
    },
    gallery: [
      {
        alt: "MacSweep System Junk scan listing caches with sizes",
        height: 1125,
        src: "/product/system-junk.png",
        width: 1341,
      },
      {
        alt: "MacSweep package manager cache cleanup",
        height: 1234,
        src: "/product/developer-tools.png",
        width: 1341,
      },
    ],
  },
  sections: {
    featureHeading: "See it before you delete it.",
    featureDescription:
      "Every scan reports what it found and how much space it frees before anything is removed. Credentials, keychains, and protected folders never make the list.",
    galleryHeading: "Inside MacSweep",
    availabilityLabel: "Install",
    availabilityHeading: "Download it, or install it with Homebrew.",
    availabilityDescription:
      "The cask installs the SwiftUI app and the CLI together. Signed and notarized, so it opens on the first try — and the full source is on GitHub.",
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
