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
    kind: "menubar-preview",
    logo: {
      alt: "",
      height: 512,
      src: "/product/logo.png",
      width: 512,
    },
    ariaLabel:
      "Mock of the MeterBar menu bar dropdown, showing a Codex account with 93% of the session window and 17% of the weekly window left, plus reset countdowns.",
    caption:
      "Illustrative data — MeterBar reads live usage from the providers already signed in on your Mac.",
    menuBarClock: "Thu 9:41 AM",
    menuBarStatus: "17%",
    accountName: "Codex",
    accountPlan: "Pro",
    updatedLabel: "Updated just now",
    windows: [
      {
        label: "Session",
        remaining: 93,
        state: "healthy",
        resetLabel: "Session reset in 2h 49m",
      },
      {
        label: "Weekly",
        remaining: 17,
        state: "tight",
        resetLabel: "Weekly reset in 3h 49m",
        note: "1 reset available",
      },
    ],
    stats: [
      { label: "Tightest window", value: "17% left" },
      { label: "30-day tokens", value: "32.6B" },
      { label: "Tracked sources", value: "3" },
    ],
    gallery: [
      {
        alt: "MeterBar overview window tracking Codex, Claude, and Cursor usage limits",
        height: 700,
        src: "/product/overview.png",
        width: 1040,
      },
      {
        alt: "MeterBar macOS widget showing quota usage",
        height: 436,
        src: "/product/widget-medium.png",
        width: 776,
      },
    ],
  },
  providers: {
    heading: "Three providers, read locally.",
    description:
      "MeterBar reads the auth and usage state these tools already keep on your Mac. Nothing new to sign into.",
    items: [
      { name: "Claude Code", detail: "Session and weekly windows" },
      { name: "Codex CLI", detail: "Session, weekly, and reset credits" },
      { name: "Cursor", detail: "Local auth and usage state" },
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
        "Reuses the sign-ins already on your Mac. No account, no telemetry — and the exact read paths are listed below.",
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
  privacy: {
    label: "Privacy",
    heading: "It reads the sign-ins you already have.",
    description:
      "MeterBar has no account, no server of its own, and no telemetry. Every provider it tracks is one you already logged into on this Mac, and it reads that existing session in place — it never asks you for a password and never copies a credential somewhere new. The full list is below, and all of it is checkable in the source.",
    reads: [
      {
        title: "Claude Code",
        detail:
          "Reads the OAuth token Claude Code already stored, and sends it only to Anthropic's own usage endpoint. If no token is readable, it falls back to parsing the output of claude /usage instead.",
        source: "Keychain — Claude Code-credentials",
      },
      {
        title: "Codex CLI",
        detail:
          "Reads the token codex login wrote, then calls ChatGPT's own usage endpoint with it. Honors CODEX_HOME when you have moved that directory.",
        source: "~/.codex/auth.json",
      },
      {
        title: "Cursor",
        detail:
          "Queries Cursor's local database for the session token the editor already holds, then reads your monthly usage from cursor.com.",
        source: "~/Library/Application Support/Cursor",
      },
      {
        title: "Grok",
        detail:
          "Checks only whether the login exists. The billing figures come back from the official Grok CLI over its own protocol — MeterBar never reads or stores that token itself.",
        source: "~/.grok/auth.json",
      },
      {
        title: "Cost scan",
        detail:
          "An optional 30-day scan that totals the token-count and model fields in local session transcripts. It never reads prompt or response text, and it makes no network calls at all.",
        source: "~/.claude/projects, Codex session logs",
      },
      {
        title: "OpenRouter",
        detail:
          "The one credential MeterBar stores itself: an API key you paste into Settings, kept in MeterBar's own Keychain item and used only against openrouter.ai.",
        source: "Keychain — dev.meterbar.app",
      },
    ],
    permissionsHeading: "Prompts macOS will show you",
    permissions: [
      {
        title: "Keychain access, once",
        detail:
          "On first launch macOS asks whether MeterBar may read the Claude Code-credentials item. That single read is how Claude usage arrives without a login. Deny it and MeterBar falls back to the CLI, and you can switch the OAuth read off in Settings at any time.",
      },
      {
        title: "Notifications, optional",
        detail:
          "Requested once so quota warnings and session-wake alerts can appear. Decline it and every other part of the app keeps working.",
      },
      {
        title: "Login Items, only if you opt in",
        detail:
          "Enabling Launch at Login or Session Wake registers a helper through SMAppService, so MeterBar shows up under System Settings → General → Login Items. Both stay off until you turn them on.",
      },
      {
        title: "No Full Disk Access",
        detail:
          "MeterBar never requests it. Everything listed above sits in your home directory or your login Keychain, none of which is behind that permission.",
      },
    ],
    guaranteesHeading: "Also true",
    guarantees: [
      "No account, no sign-up, and no MeterBar server for anything to be sent to.",
      "No analytics, no telemetry, no crash reporting.",
      "Outbound requests go only to your own providers' usage endpoints.",
      "The widget is sandboxed. The main app is not, because it has to read other tools' files — hardened runtime is enabled for both.",
      "MIT licensed, so every path listed here can be checked against the source.",
    ],
    sourceLink: {
      href: "https://github.com/VincentShipsIt/meterbar.dev#privacy--security",
      label: "Check it in the source",
    },
  },
  footerNote: "Built by VincentShipsIt. Free, open source, no upsells.",
}
