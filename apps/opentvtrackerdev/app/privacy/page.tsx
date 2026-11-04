import { openTVTrackerLanding } from "@workspace/landing"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

const SOURCE_URL = `${openTVTrackerLanding.repoUrl}/blob/main/PRIVACY.md`

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy - OpenTV Tracker",
  description:
    "What OpenTV Tracker stores, what leaves your iPhone, and how to delete it.",
}

type PolicySection = {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

// Mirrors PRIVACY.md in the app repository, which is the source of truth.
// Update both together; the page links to the repository copy.
const SECTIONS: PolicySection[] = [
  {
    heading: "Local by default",
    paragraphs: [
      "OpenTV works without an account. Watch state, progress, ratings, notes, the viewing diary, custom lists, subscription choices, recommendation feedback, content-language preference, and imports stay in local SwiftData on your iPhone by default.",
    ],
  },
  {
    heading: "Partner sharing",
    paragraphs: [
      "Partner sharing is optional and uses an invitation-only CloudKit share in your own iCloud. The share contains:",
    ],
    items: [
      "the shared watchlist and shared activity;",
      "member identifiers and taste preferences;",
      "watched and correction events;",
      "episode reactions and notes attached to an exact shared watch event;",
      "conversation deletion tombstones;",
      "title metadata needed to render shared titles; and",
      "shared custom lists.",
    ],
  },
  {
    heading: "What never enters a share",
    paragraphs: [
      "Personal notes on the rest of your library, the private diary, Trakt imported lists, provider credentials, OpenRouter credentials, and App Attest credentials do not enter the share. The owner can revoke a share and a participant can leave. Sign-out and account switching purge retained shared cache, sync state, and outbox data before another account is used.",
    ],
  },
  {
    heading: "Recommendations and OpenRouter",
    paragraphs: [
      "Deterministic recommendations run on your device and are the default. Optional AI reranking is off until you connect an OpenRouter account and enable it.",
      "OpenRouter sign-in uses PKCE. The API key returned by OpenRouter is stored as a this-device-only Keychain item and sent only to openrouter.ai. It is never sent to the OpenTV proxy, the developer, CloudKit, analytics, or logs.",
      "A reranking request contains up to 20 public candidates (catalog ID, title, genres, runtime, rating, providers, and a deterministic score and reason), your mood and optional runtime limit, and a viewing profile of aggregate counts plus up to 20 recent titles. It excludes notes, member names, private watch events, diary text, and list names, and it does not send the raw watch-event log. OpenRouter receives the request directly and applies its own privacy policy.",
      "Disconnecting OpenRouter deletes the Keychain item from your device. Revoke the key in OpenRouter to invalidate it remotely. A timeout, revoked key, quota failure, or provider outage silently restores the deterministic order.",
    ],
  },
  {
    heading: "Official catalog and cinema proxy",
    paragraphs: [
      "The official app may send catalog query text, media kind, page, region, catalog ID, content-language code, cinema date, and TVDB identifiers (for confirmed import resolution) to the OpenTV proxy. Each request also contains App Attest material: a public key identifier, one-time challenge identifier, short-lived service token, and cryptographic assertion. The proxy stores the verified public key, Apple receipt, environment, monotonic counter, and registration and last-seen timestamps. These are security identifiers, not advertising identifiers, and are not used for cross-app tracking.",
      "Production request logs contain only a random request ID, method, route path, status, coarse error code, and duration. They exclude IP addresses, query values, bodies, App Attest keys, assertions and tokens, OpenRouter credentials, and personal data. IP addresses are hashed transiently in memory only for quota enforcement.",
      "Devices without App Attest support do not receive anonymous access to the official hosted proxy. The app falls back to TVmaze and official cinema sources.",
    ],
  },
  {
    heading: "Ask OpenTV speech",
    paragraphs: [
      "Ask OpenTV may use the microphone and Apple Speech Recognition only while you hold the voice control. Spoken audio is used to produce a discovery query and is not stored by OpenTV. Recognition may use Apple's speech service. The resulting text is treated as catalog query text if you submit it. Denying microphone or speech permission leaves typed search available.",
    ],
  },
  {
    heading: "Widgets and App Group",
    paragraphs: [
      "Home-screen widgets read a bounded Up Next and upcoming snapshot from the App Group. That snapshot contains title names, short detail text, dates, and SF Symbol names. It does not contain notes, diary text, ratings, credentials, or CloudKit identifiers.",
    ],
  },
  {
    heading: "Optional Trakt sync",
    paragraphs: [
      "Trakt sync is off until you connect an account with device authorization. The resulting access and refresh tokens are stored as this-device-only Keychain items and sent only to api.trakt.tv. Sync sends TMDB identifiers, movie or episode watch dates, integer ratings, and watchlist changes, and imports the same fields plus personal-list names and membership. It never sends private notes, diary entries, partner activity or member identities, recommendation feedback, moods, subscription choices, or OpenRouter credentials.",
      "Disconnecting removes the Trakt token from your device and asks Trakt to revoke it when the network is available. Local tracking continues unchanged when disconnected or offline.",
    ],
  },
  {
    heading: "Control and deletion",
    paragraphs: [
      "Library data can be exported as versioned JSON, or as CSV for titles, watch events, diary, conversations, and lists. Removing the app removes local data, the App Group widget snapshot, and Keychain credentials. Revoking or leaving a partner share removes CloudKit access and purges retained shared state. Proxy operators can remove an App Attest device record on request.",
      "OpenTV does not sell data, track users across apps, or include advertising SDKs.",
    ],
  },
  {
    heading: "Security reports",
    paragraphs: [
      "Report security issues privately as described in the repository security policy.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-background px-5 py-16 text-foreground">
      <article className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <Link className="flex items-center gap-3" href="/">
            <Image
              alt=""
              className="size-10 rounded-xl"
              height={40}
              src="/product/logo.png"
              width={40}
            />
            <span className="font-heading text-lg font-semibold">
              OpenTV Tracker
            </span>
          </Link>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.035em]">
            Privacy
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            OpenTV works without an account and keeps your library on your
            iPhone. This page is the privacy policy for the OpenTV Tracker iOS
            app. The canonical, versioned copy lives in the{" "}
            <a className="underline underline-offset-4" href={SOURCE_URL}>
              open-source repository
            </a>
            .
          </p>
        </header>

        {SECTIONS.map((section) => (
          <section className="flex flex-col gap-3" key={section.heading}>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em]">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p
                className="text-base leading-7 text-muted-foreground"
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
            {section.items ? (
              <ul className="list-disc pl-6 text-base leading-7 text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <footer className="flex flex-wrap gap-3">
          <Link className={cn(buttonVariants({ variant: "outline" }))} href="/">
            Back to opentvtracker.dev
          </Link>
          <a
            className={cn(buttonVariants({ variant: "outline" }))}
            href={`${openTVTrackerLanding.repoUrl}/blob/main/SECURITY.md`}
          >
            Security policy
          </a>
        </footer>
      </article>
    </main>
  )
}
