import { Card, CardContent } from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/components/button"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProfileShareButtons } from "@/components/profile-share-buttons"
import { getPublicProfile } from "@/lib/profile/cache"
import { isValidSlug, type ProfileDocument } from "@/lib/profile/schema"
import {
  BAND_COLOR,
  bandFor,
  cardAlt,
  formatTokens,
  percentLeft,
  providerColor,
  relativeTime,
} from "@/lib/profile/view"

// Profile availability is checked on every request; no shared HTML/RSC cache.
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

const TITLE = "AI coding limits on MeterBar"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = isValidSlug(slug) ? await getPublicProfile(slug) : null
  // A profile page is shared as a link, not a search result: keep it out of
  // indexes, and give a missing one nothing to preview.
  if (!profile) return { robots: { follow: false, index: false }, title: TITLE }

  const description = cardAlt(profile)
  const image = {
    alt: description,
    height: 630,
    url: `/u/${slug}/og`,
    width: 1200,
  }
  return {
    alternates: { canonical: `/u/${slug}` },
    description,
    openGraph: {
      description,
      images: [image],
      siteName: "MeterBar",
      title: TITLE,
      type: "website",
      url: `/u/${slug}`,
    },
    robots: { follow: false, index: false },
    title: TITLE,
    twitter: {
      card: "summary_large_image",
      description,
      images: [image.url],
      title: TITLE,
    },
  }
}

function LimitBar({ used }: { used: number }) {
  const band = bandFor(100 - used)
  return (
    <div
      aria-hidden
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full rounded-full"
        style={{ background: BAND_COLOR[band], width: `${Math.max(2, used)}%` }}
      />
    </div>
  )
}

function ProviderCard({
  provider,
}: {
  provider: ProfileDocument["providers"][number]
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 rounded-full"
            style={{ background: providerColor(provider.provider) }}
          />
          <h2 className="text-base font-semibold">{provider.name}</h2>
          {provider.plan ? (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {provider.plan}
            </span>
          ) : null}
        </div>
        <ul className="flex flex-col gap-3">
          {provider.windows.map((window) => {
            const left = percentLeft(window)
            return (
              <li className="flex flex-col gap-1.5" key={window.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm">{window.label}</span>
                  <span
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: BAND_COLOR[bandFor(left)] }}
                  >
                    {left}% left
                  </span>
                </div>
                <LimitBar used={window.usedPercent} />
                {window.pace || window.resetsAt ? (
                  <p className="text-xs text-muted-foreground">
                    {[
                      window.pace,
                      window.resetsAt
                        ? `resets ${new Date(window.resetsAt).toUTCString().replace(" GMT", " UTC")}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

function Receipt({
  receipt,
}: {
  receipt: NonNullable<ProfileDocument["receipt"]>
}) {
  const peak = Math.max(1, ...receipt.dailyTokens)
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <h2 className="text-base font-semibold">Last 30 days</h2>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">
              {formatTokens(receipt.tokens30d)}
            </span>{" "}
            tokens
            {receipt.sessions !== null
              ? ` across ${receipt.sessions.toLocaleString("en-US")} sessions`
              : ""}
          </p>
        </div>
        <div
          aria-label="Tokens per day, last 7 days"
          className="flex h-16 items-end gap-1.5"
          role="img"
        >
          {receipt.dailyTokens.map((tokens, index) => (
            <div
              className="flex-1 rounded-sm bg-foreground/70"
              key={index}
              style={{ height: `${Math.max(4, (tokens / peak) * 100)}%` }}
            />
          ))}
        </div>
        {receipt.models.length > 0 ? (
          <ul className="flex flex-col gap-1.5 text-sm">
            {receipt.models.map((model) => (
              <li
                className="flex items-center justify-between gap-3"
                key={`${model.provider}-${model.name}`}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ background: providerColor(model.provider) }}
                  />
                  <span className="font-mono text-xs">{model.name}</span>
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {formatTokens(model.tokens)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params
  if (!isValidSlug(slug)) notFound()
  const profile = await getPublicProfile(slug)
  if (!profile) notFound()
  const url = `https://meterbar.dev/u/${slug}`

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-4 py-10 sm:py-14">
      <header className="flex flex-col gap-2">
        <Link
          className="text-sm text-muted-foreground hover:text-foreground"
          href="/"
        >
          MeterBar
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">
          AI coding limits
        </h1>
        <p className="text-sm text-muted-foreground">
          Published from a Mac running MeterBar. No name, email or account is
          attached. Updated {relativeTime(profile.updatedAt)}.
        </p>
      </header>

      <ProfileShareButtons
        text="My AI coding limits, live on MeterBar"
        url={url}
      />

      <section aria-label="Limits" className="flex flex-col gap-4">
        {profile.providers.map((provider) => (
          <ProviderCard key={provider.name} provider={provider} />
        ))}
      </section>

      {profile.receipt ? <Receipt receipt={profile.receipt} /> : null}

      <footer className="flex flex-col gap-3 border-t pt-6">
        <p className="text-sm text-muted-foreground">
          MeterBar is a free, open-source menu bar app that tracks Claude Code,
          Codex, Cursor and more.
        </p>
        <div>
          <Link className={buttonVariants({ size: "sm" })} href="/">
            Get MeterBar
          </Link>
        </div>
      </footer>
    </main>
  )
}
