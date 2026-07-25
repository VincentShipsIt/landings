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
  featureStories: [
    {
      ariaLabel:
        "Mock of the MeterBar menu bar item opened over a panel of usage meters for Claude Code, Codex CLI, and Cursor",
      description:
        "MeterBar keeps one number in the menu bar: the window closest to running out. Open it and every tracked limit is there with the time left before it resets.",
      eyebrow: "Menu bar",
      highlights: [
        "The tightest limit is the one promoted to the menu bar.",
        "Every provider window and reset time in one panel.",
        "No dashboard, no browser tab, no provider login.",
      ],
      icon: Activity,
      mock: {
        kind: "menu-bar",
        appName: "MeterBar",
        footnote:
          "The menu bar shows the tightest window; the panel shows all of them.",
        menuBarLabel: "82%",
        meters: [
          {
            label: "Claude Code · 5-hour window",
            percent: 82,
            tone: "warning",
            value: "82% used · resets in 47m",
          },
          {
            label: "Codex CLI · weekly",
            percent: 46,
            tone: "accent",
            value: "46% used · resets Monday",
          },
          {
            label: "Cursor · monthly",
            percent: 23,
            tone: "neutral",
            value: "23% used · resets in 12 days",
          },
        ],
        panelBadge: "Updated just now",
        panelTitle: "Usage limits",
      },
      title: "The tightest limit, always in view.",
    },
    {
      ariaLabel:
        "Mock of small, medium, and large MeterBar widgets sitting together in Notification Center",
      description:
        "The same provider state renders as small, medium, and large widgets, so the number you check between prompts is one swipe away instead of one click into the menu bar.",
      eyebrow: "Widgets",
      highlights: [
        "Three sizes reading from the same local state.",
        "Small for the tightest window, large for the full breakdown.",
      ],
      icon: Gauge,
      mock: {
        kind: "tiles",
        footnote: "One data source, three widget sizes.",
        tiles: [
          {
            caption: "Tightest window",
            label: "Small",
            size: "small",
            value: "82%",
          },
          {
            caption: "Each provider at a glance",
            label: "Medium",
            size: "medium",
            value: "3 providers",
          },
          {
            caption: "Every window, with the time left on it",
            label: "Large",
            size: "large",
            value: "Full breakdown",
          },
        ],
        title: "Notification Center",
      },
      title: "The same state, in Notification Center.",
    },
    {
      ariaLabel:
        "Mock of MeterBar's provider list showing Claude Code and Codex CLI tracking, and Cursor idle until it is signed in",
      description:
        "There is nothing to connect. MeterBar reads the auth and usage state the CLIs already keep on disk, and a provider you have not signed into simply sits idle until you do.",
      eyebrow: "Providers",
      highlights: [
        "Claude Code, Codex CLI, and Cursor from their local surfaces.",
        "Providers appear as they are detected, not as you configure them.",
      ],
      icon: Boxes,
      mock: {
        kind: "status",
        footnote: "MeterBar reads provider state that is already on disk.",
        rows: [
          {
            detail: "Local CLI state in ~/.claude",
            label: "Claude Code",
            status: "Tracking",
            tone: "accent",
          },
          {
            detail: "Local CLI state in ~/.codex",
            label: "Codex CLI",
            status: "Tracking",
            tone: "accent",
          },
          {
            detail: "Nothing to read until you sign in",
            label: "Cursor",
            status: "Idle",
            tone: "neutral",
          },
        ],
        title: "Providers found on this Mac",
      },
      title: "Reads the CLIs you already signed into.",
    },
    {
      ariaLabel:
        "Mock of a terminal showing MeterBar holding no network connections and passing the macOS notarization check",
      description:
        "Credentials never move. MeterBar has no account, no server, and nothing to upload — which is a claim you can check yourself in a terminal rather than take on trust.",
      eyebrow: "Privacy",
      highlights: [
        "No account to create and no telemetry to opt out of.",
        "Signed and notarized, so Gatekeeper opens it on the first try.",
      ],
      icon: LockKeyhole,
      mock: {
        kind: "terminal",
        lines: [
          { text: "# What MeterBar sends off this Mac", tone: "comment" },
          { text: "lsof -i -P -n | grep MeterBar", tone: "command" },
          { text: "(no output)", tone: "output" },
          { text: "# And what Gatekeeper makes of it", tone: "comment" },
          {
            text: "spctl -a -t exec /Applications/MeterBar.app",
            tone: "command",
          },
          { text: "/Applications/MeterBar.app: accepted", tone: "output" },
        ],
        title: "Local only",
      },
      title: "Nothing leaves the Mac.",
    },
  ],
  footerNote: "Built by VincentShipsIt. Free, open source, no upsells.",
}
