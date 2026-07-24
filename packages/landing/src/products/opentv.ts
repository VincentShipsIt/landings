import {
  BrainCircuit,
  Cloud,
  History,
  ListChecks,
  Smartphone,
  UsersRound,
} from "lucide-react"

import type { LandingProduct } from "../types"
import { OG_CARD_DIMENSIONS, SUBSCRIBE_PLACEHOLDER } from "./shared"

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
  platformRequirement: "Requires iOS 26 or later",
  ogImage: {
    ...OG_CARD_DIMENSIONS,
    alt: "OpenTV Tracker — private TV tracking for one person or two.",
    src: "/opengraph-image",
  },
  visual: {
    kind: "screenshots",
    logo: {
      alt: "",
      height: 256,
      src: "/product/logo.png",
      width: 256,
    },
    primary: {
      alt: "OpenTV Tracker Up Next screen showing Ghosts episode progress and artwork",
      height: 1220,
      src: "/product/up-next.png",
      width: 563,
    },
    gallery: [
      {
        alt: "OpenTV Tracker artwork-led discovery categories and recommendation assistant",
        height: 550,
        src: "/product/discover.png",
        width: 470,
      },
      {
        alt: "OpenTV Tracker recommendations based on selected streaming services",
        height: 404,
        src: "/product/recommendations.png",
        width: 470,
      },
    ],
  },
  sections: {
    featureHeading: "A watch history that works for you.",
    featureDescription:
      "OpenTV combines quick progress controls, private partner sharing, and recommendations that can explain why a title fits.",
    galleryHeading: "Inside OpenTV Tracker",
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
  subscribe: {
    buttonLabel: "Notify me",
    description: "One email when TestFlight invitations open. Nothing else.",
    fallbackLabel: "Or follow the TestFlight issue on GitHub",
    fallbackUrl: "https://github.com/VincentShipsIt/opentvtracker/issues/46",
    heading: "Get the TestFlight invite",
    placeholder: SUBSCRIBE_PLACEHOLDER,
    successMessage: "You are on the list. Watch for the TestFlight invite.",
  },
  footerNote:
    "Built by VincentShipsIt. Open source, private by default, no public activity feed.",
}
