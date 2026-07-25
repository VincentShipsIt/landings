import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"
import {
  ArrowUpRight,
  BatteryFull,
  Bot,
  CalendarClock,
  ChevronRight,
  Circle,
  Clock,
  Download,
  GitFork,
  Images,
  Laptop,
  Plus,
  RefreshCw,
  Sparkles,
  Smartphone,
  Terminal,
  Wifi,
} from "lucide-react"
import Image from "next/image"
import type { CSSProperties } from "react"

import { CopyCommandButton } from "./copy-command-button"
import { CopyPromptButton } from "./copy-prompt-button"
import { PRIMARY_CTA_CLASS } from "./cta"
import { getLatestRelease, type LatestRelease } from "./download"
import { formatFileSize } from "./format"
import type { LandingImage, LandingProduct, MenuBarWindowState } from "./types"

type ProductProps = {
  product: LandingProduct
}

type ReleaseProps = ProductProps & {
  /** Resolved GitHub release, or null when the lookup failed or does not apply. */
  release: LatestRelease | null
}

export async function LandingPage({ product }: ProductProps) {
  const release = await getLatestRelease(product)

  return (
    <main
      className="min-h-svh bg-background text-foreground"
      style={
        {
          "--product-accent": product.accent,
          // Accents sit around L 0.67, which is too light for white button text.
          // Darkening keeps the brand hue while clearing WCAG AA.
          "--product-accent-ink":
            "color-mix(in oklab, var(--product-accent), black 16%)",
          "--product-accent-soft": product.accentSoft,
        } as CSSProperties
      }
    >
      <SiteHeader product={product} />
      <Hero product={product} release={release} />
      <ProviderSection product={product} />
      <FeatureSection product={product} />
      <ProductGallery product={product} />
      <AvailabilitySection product={product} release={release} />
      <SiteFooter product={product} />
    </main>
  )
}

function SiteHeader({ product }: ProductProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a className="flex items-center gap-3" href="/">
          <ProductMark product={product} />
          <span className="font-heading text-sm font-semibold tracking-tight">
            {product.name}
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
        >
          {product.providers ? (
            <a
              className="transition-colors hover:text-foreground"
              href="#providers"
            >
              Coverage
            </a>
          ) : null}
          <a
            className="transition-colors hover:text-foreground"
            href="#features"
          >
            Features
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="#availability"
          >
            {product.sections.availabilityLabel}
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href={product.repoUrl}
          >
            Source
          </a>
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a
            className={cn(buttonVariants({ size: "sm" }), PRIMARY_CTA_CLASS)}
            href={product.distribution.primaryUrl}
          >
            {product.primaryCta}
            <ArrowUpRight data-icon="inline-end" />
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero({ product, release }: ReleaseProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
        <div className="flex flex-col gap-7">
          <div className="flex flex-wrap items-center gap-2">
            {release ? (
              <Badge variant="outline">Latest {release.version}</Badge>
            ) : null}
            {product.proof.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-3xl font-heading text-5xl leading-[0.92] font-semibold tracking-[-0.045em] md:text-7xl">
              {product.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              {product.heroCopy}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <HeroActions product={product} />
            </div>
            <HeroInstallCommand product={product} />
            <DownloadMeta product={product} release={release} />
          </div>
        </div>
        <ProductVisual product={product} />
      </div>
    </section>
  )
}

/**
 * The three facts a download decision needs — OS floor, size, version — sitting
 * directly under the button instead of buried in the availability notes.
 */
function DownloadMeta({ product, release }: ReleaseProps) {
  const parts = [
    product.platformRequirement,
    formatFileSize(release?.fileSize),
    release?.version ? `Version ${release.version}` : null,
  ].filter((part): part is string => Boolean(part))

  if (!parts.length) return null

  return <p className="text-sm text-muted-foreground">{parts.join(" · ")}</p>
}

/**
 * Package-manager users can install without ever reaching the availability
 * section, so the one-liner is repeated above the fold.
 */
function HeroInstallCommand({ product }: ProductProps) {
  if (product.distribution.kind !== "github-release") return null

  return <CopyCommandButton command={product.distribution.installCommand} />
}

/**
 * Screenshot galleries are optional per visual kind, so the union is narrowed
 * in one place rather than at each call site.
 */
function getVisualGallery(visual: LandingProduct["visual"]): LandingImage[] {
  return visual.kind === "interface-preview" ? [] : visual.gallery
}

function ProductVisual({ product }: ProductProps) {
  if (product.visual.kind === "interface-preview") {
    return <InterfacePreview product={product} />
  }

  if (product.visual.kind === "menubar-preview") {
    return <MenuBarPreview product={product} />
  }

  const { primary } = product.visual

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-10 h-40 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--product-accent-soft)" }}
      />
      <div className="relative mx-auto w-fit overflow-hidden rounded-xl border bg-card shadow-sm">
        <Image
          alt={primary.alt}
          className="h-auto max-h-[37.5rem] w-auto max-w-full"
          height={primary.height}
          priority
          sizes="(min-width: 1024px) 40rem, 100vw"
          src={primary.src}
          width={primary.width}
        />
      </div>
    </div>
  )
}

function InterfacePreview({ product }: ProductProps) {
  const visual = product.visual

  if (visual.kind !== "interface-preview") return null

  return (
    <div aria-label={visual.ariaLabel} className="relative" role="img">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-10 h-52 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--product-accent-soft)" }}
      />
      <div className="relative overflow-hidden rounded-3xl border bg-card/95 shadow-2xl shadow-black/10">
        <div className="flex h-11 items-center gap-2 border-b bg-muted/50 px-4">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-auto text-[0.68rem] font-medium tracking-wide text-muted-foreground uppercase">
            {visual.previewLabel}
          </span>
        </div>
        <div className="grid min-h-[31rem] sm:grid-cols-[10.5rem_1fr]">
          <aside className="hidden border-r bg-muted/35 p-4 sm:block">
            <div className="mb-6 flex items-center gap-2">
              <ProductMark product={product} />
              <span className="text-sm font-semibold">{product.name}</span>
            </div>
            <div className="space-y-1.5 text-sm">
              {visual.navItems.map((item) => (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-2",
                    item.selected
                      ? "bg-background font-medium shadow-sm"
                      : "text-muted-foreground"
                  )}
                  key={item.label}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </div>
              ))}
            </div>
          </aside>
          <div className="flex min-w-0 flex-col p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {visual.previewEyebrow}
                </p>
                <h2 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
                  {visual.previewTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-xs font-medium shadow-sm">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {visual.previewAction}
              </div>
            </div>
            <div className="mt-7 flex flex-1 flex-col">
              <div className="divide-y">
                {visual.previewItems.map((item) => (
                  <div className="flex items-start gap-3 py-4" key={item.title}>
                    <Circle
                      className="mt-0.5 size-5 shrink-0 text-[var(--product-accent)]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-3 rounded-2xl border bg-background/90 p-3.5 shadow-lg shadow-black/5">
                <Plus
                  className="size-5 text-[var(--product-accent)]"
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground">
                  {visual.composerPlaceholder}
                </span>
                <span className="ml-auto hidden rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background sm:inline-flex">
                  {visual.composerAction}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {visual.caption}
      </p>
    </div>
  )
}

const METER_FILL: Record<MenuBarWindowState, string> = {
  critical: "bg-red-500",
  healthy: "bg-[var(--product-accent)]",
  tight: "bg-amber-500",
}

const METER_TEXT: Record<MenuBarWindowState, string> = {
  critical: "text-red-600 dark:text-red-400",
  healthy: "text-foreground",
  tight: "text-amber-600 dark:text-amber-400",
}

/**
 * Coded mock of the menu bar dropdown. A screenshot of a menu bar app is mostly
 * empty desktop, so the interface is rebuilt at hero scale instead.
 */
function MenuBarPreview({ product }: ProductProps) {
  const visual = product.visual

  if (visual.kind !== "menubar-preview") return null

  return (
    <div aria-label={visual.ariaLabel} className="relative" role="img">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-10 h-52 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--product-accent-soft)" }}
      />
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/10">
        {/*
          Order matches macOS: third-party status items sit left of the system
          icons, which sit left of the clock. The app's own item is highlighted
          because its menu is open below.
        */}
        <div className="flex h-9 items-center gap-3 border-b bg-muted/50 px-4 text-xs">
          <span className="ml-auto flex items-center gap-1.5 rounded-md bg-background px-2 py-1 font-medium shadow-sm ring-1 ring-border">
            <Image
              alt=""
              className="size-4 rounded-sm"
              height={32}
              src={visual.logo.src}
              width={32}
            />
            {visual.menuBarStatus}
          </span>
          <span
            aria-hidden="true"
            className="flex items-center gap-2.5 text-muted-foreground/50"
          >
            <Wifi className="size-3.5" />
            <BatteryFull className="size-3.5" />
          </span>
          <span className="text-muted-foreground">{visual.menuBarClock}</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">
                {visual.accountName}
              </p>
              <Badge variant="secondary">{visual.accountPlan}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {visual.updatedLabel}
            </p>
          </div>
          <RefreshCw
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
        </div>
        <div className="divide-y">
          {visual.windows.map((meter) => (
            <div className="px-5 py-4" key={meter.label}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-muted-foreground">{meter.label}</p>
                <p
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    METER_TEXT[meter.state]
                  )}
                >
                  {meter.remaining}% left
                </p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", METER_FILL[meter.state])}
                  style={{ width: `${meter.remaining}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock aria-hidden="true" className="size-3.5" />
                  {meter.resetLabel}
                </span>
                {meter.note ? <span>{meter.note}</span> : null}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-px border-t bg-border">
          {visual.stats.map((stat) => (
            <div className="bg-card px-5 py-4" key={stat.label}>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {visual.caption}
      </p>
    </div>
  )
}

/**
 * Coverage strip. "Does it support my tool?" is the first question about an
 * integration utility, so it answers above the feature grid.
 *
 * Deliberately scaled below the other sections: tighter padding and a smaller
 * heading. It shares the hero's untinted background, so reading as a strip
 * attached to the hero — rather than as a peer of the tinted feature band —
 * keeps the page's plain/tinted alternation legible.
 */
function ProviderSection({ product }: ProductProps) {
  const providers = product.providers

  if (!providers) return null

  return (
    <section id="providers" className="border-t py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">
            {providers.heading}
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {providers.description}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providers.items.map((item) => (
            <div className="rounded-lg border px-4 py-3.5" key={item.name}>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureSection({ product }: ProductProps) {
  return (
    <section id="features" className="border-t bg-muted/30 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            {product.sections.featureHeading}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {product.sections.featureDescription}
          </p>
        </div>
        <div
          className={cn(
            "grid gap-4 md:grid-cols-2",
            product.features.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          )}
        >
          {product.features.map((feature) => (
            <Card key={feature.title} className="rounded-lg *:rounded-lg">
              <CardHeader>
                <feature.icon className="size-5" aria-hidden="true" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductGallery({ product }: ProductProps) {
  const images = getVisualGallery(product.visual)

  if (!images.length) return null

  return (
    <section className="border-t py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5">
        <div className="flex items-center gap-3">
          <Images className="size-5" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-semibold tracking-[-0.025em] md:text-3xl">
            {product.sections.galleryHeading}
          </h2>
        </div>
        <div
          className={cn("grid gap-4", images.length > 1 && "md:grid-cols-2")}
        >
          {images.map((image) => (
            <div
              className="overflow-hidden rounded-xl border bg-card shadow-sm"
              key={image.src}
            >
              <Image
                alt={image.alt}
                className="h-full max-h-[34rem] w-full object-contain object-top"
                height={image.height}
                sizes="(min-width: 768px) 36rem, 100vw"
                src={image.src}
                width={image.width}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AvailabilitySection({ product, release }: ReleaseProps) {
  return (
    <section id="availability" className="border-t bg-muted/30 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            {product.sections.availabilityHeading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            {product.sections.availabilityDescription}
          </p>
          <div className="flex flex-col gap-3">
            {product.distribution.notes.map((note) => (
              <div
                className="flex gap-3 text-sm text-muted-foreground"
                key={note}
              >
                <ChevronRight
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
        {product.distribution.kind === "github-release" ? (
          <ReleaseCard product={product} release={release} />
        ) : product.distribution.kind === "multi-platform" ? (
          <MultiPlatformCard product={product} />
        ) : (
          <PreviewCard product={product} />
        )}
      </div>
    </section>
  )
}

function MultiPlatformCard({ product }: ProductProps) {
  const distribution = product.distribution

  if (distribution.kind !== "multi-platform") return null

  const platforms = [
    {
      actionLabel: distribution.macOS.actionLabel,
      description: distribution.macOS.description,
      icon: Laptop,
      name: "macOS",
      statusLabel: distribution.macOS.statusLabel,
      // The card CTA goes through the same-origin redirect the hero uses, so
      // both paths resolve the versioned asset instead of the releases page.
      url: distribution.primaryUrl,
    },
    {
      actionLabel: distribution.iOS.actionLabel,
      description: distribution.iOS.description,
      icon: Smartphone,
      name: "iPhone",
      statusLabel: distribution.iOS.statusLabel,
      url: distribution.iOS.url,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {platforms.map((platform) => (
        <Card className="rounded-lg *:rounded-lg" key={platform.name}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <platform.icon className="size-4" aria-hidden="true" />
                {platform.name}
              </div>
              <Badge variant="secondary">{platform.statusLabel}</Badge>
            </div>
            <CardDescription>{platform.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {platform.url ? (
              <a
                className={cn(
                  buttonVariants({ size: "lg" }),
                  PRIMARY_CTA_CLASS,
                  "w-full"
                )}
                href={platform.url}
              >
                <Download data-icon="inline-start" />
                {platform.actionLabel}
              </a>
            ) : (
              <button
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "w-full cursor-not-allowed opacity-60"
                )}
                disabled
                type="button"
              >
                <Smartphone data-icon="inline-start" />
                {platform.actionLabel}
              </button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ReleaseCard({ product, release }: ReleaseProps) {
  const distribution = product.distribution

  if (distribution.kind !== "github-release") return null

  const { copy } = distribution

  return (
    <Card className="rounded-lg *:rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Download className="size-4" aria-hidden="true" />
            {copy.cardLabel}
          </div>
          {release ? (
            <Badge variant="secondary">{release.version}</Badge>
          ) : null}
        </div>
        <CardDescription>{copy.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className={cn(buttonVariants({ size: "lg" }), PRIMARY_CTA_CLASS)}
              href={distribution.primaryUrl}
            >
              <Download data-icon="inline-start" />
              {product.primaryCta}
            </a>
            <a
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              href={distribution.releasesUrl}
            >
              {copy.allReleasesLabel}
              <ArrowUpRight data-icon="inline-end" />
            </a>
          </div>
          <DownloadMeta product={product} release={release} />
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bot className="size-4" aria-hidden="true" />
            {copy.agentLabel}
          </div>
          <CopyPromptButton
            label={copy.agentButtonLabel}
            text={distribution.agentPrompt}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Terminal className="size-4" aria-hidden="true" />
            {copy.homebrewLabel}
          </div>
          <pre className="overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 dark:bg-zinc-900">
            <code>{distribution.installCommand}</code>
          </pre>
        </div>
        <a
          className={cn(buttonVariants({ variant: "outline" }))}
          href={product.repoUrl}
        >
          <GitFork data-icon="inline-start" />
          {copy.sourceLabel}
        </a>
      </CardContent>
    </Card>
  )
}

function PreviewCard({ product }: ProductProps) {
  const distribution = product.distribution

  if (distribution.kind !== "preview") return null

  return (
    <Card className="rounded-lg *:rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="size-4" aria-hidden="true" />
            {product.sections.availabilityLabel}
          </div>
          <Badge variant="secondary">{distribution.statusLabel}</Badge>
        </div>
        <CardTitle>{distribution.cardTitle}</CardTitle>
        <CardDescription>{distribution.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <a
          className={cn(buttonVariants({ size: "lg" }), PRIMARY_CTA_CLASS)}
          href={distribution.primaryActionUrl}
        >
          {distribution.primaryActionLabel}
          <ArrowUpRight data-icon="inline-end" />
        </a>
        <a
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          href={distribution.secondaryActionUrl}
        >
          {distribution.secondaryActionLabel}
        </a>
      </CardContent>
    </Card>
  )
}

function SiteFooter({ product }: ProductProps) {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <ProductMark product={product} compact />
          <span>{product.footerNote}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-foreground"
            href={`https://${product.domain}`}
          >
            {product.domain}
          </a>
          <Separator orientation="vertical" className="h-4" />
          <a className="hover:text-foreground" href={product.repoUrl}>
            Source
          </a>
          {product.xUrl ? (
            <>
              <Separator orientation="vertical" className="h-4" />
              <a className="hover:text-foreground" href={product.xUrl}>
                @{product.xUrl.split("/").pop()}
              </a>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

function HeroActions({ product }: ProductProps) {
  const distribution = product.distribution

  if (distribution.kind === "multi-platform") {
    return (
      <>
        <a
          className={cn(buttonVariants({ size: "lg" }), PRIMARY_CTA_CLASS)}
          href={distribution.primaryUrl}
        >
          <Download data-icon="inline-start" />
          {distribution.macOS.actionLabel}
        </a>
        <a
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          href={distribution.iOS.url ?? "#availability"}
        >
          <Smartphone data-icon="inline-start" />
          {distribution.iOS.actionLabel}
        </a>
      </>
    )
  }

  return (
    <>
      <a
        className={cn(buttonVariants({ size: "lg" }), PRIMARY_CTA_CLASS)}
        href={distribution.primaryUrl}
      >
        {product.primaryCta}
        <ArrowUpRight data-icon="inline-end" />
      </a>
      <a
        className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        href={product.repoUrl}
      >
        <GitFork data-icon="inline-start" />
        {product.secondaryCta}
      </a>
    </>
  )
}

function ProductMark({
  compact = false,
  product,
}: ProductProps & { compact?: boolean }) {
  const visual = product.visual

  // Only the fully synthetic preview lacks a real logo; it falls back to a
  // generated letter mark.
  if (visual.kind === "interface-preview") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-[var(--product-accent)] text-white shadow-sm",
          compact ? "size-7 rounded-md" : "size-8 rounded-lg"
        )}
      >
        <span
          className={cn(
            "font-heading leading-none font-semibold",
            compact ? "text-sm" : "text-base"
          )}
        >
          {visual.markLabel}
        </span>
      </span>
    )
  }

  return (
    <Image
      alt=""
      className={cn(compact ? "size-7 rounded-md" : "size-8 rounded-lg")}
      // Intrinsic size is pinned at 2x the largest rendered box rather than
      // the source dimensions, so the optimizer never ships a 512px logo.
      height={64}
      src={visual.logo.src}
      width={64}
    />
  )
}
