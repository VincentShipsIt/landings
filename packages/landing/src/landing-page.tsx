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
  Bot,
  CalendarClock,
  ChevronRight,
  Circle,
  Download,
  GitFork,
  Images,
  Laptop,
  Plus,
  Sparkles,
  Smartphone,
  Terminal,
} from "lucide-react"
import Image from "next/image"

import { CopyPromptButton } from "./copy-prompt-button"
import { getLatestRelease, type LatestRelease } from "./download"
import { formatFileSize } from "./format"
import type { LandingImage, LandingProduct } from "./types"

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
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader product={product} />
      <Hero product={product} release={release} />
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
            className={buttonVariants({ size: "sm" })}
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

function ProductVisual({ product }: ProductProps) {
  if (product.visual.kind === "interface-preview") {
    return <InterfacePreview product={product} />
  }

  const { primary } = product.visual

  return (
    <div className="relative">
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
                      className="mt-0.5 size-5 shrink-0 text-muted-foreground"
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
                  className="size-5 text-muted-foreground"
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
  if (product.visual.kind !== "screenshots") return null

  const images: LandingImage[] = product.visual.gallery

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
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
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
              className={buttonVariants({ size: "lg" })}
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
          className={buttonVariants({ size: "lg" })}
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
          className={buttonVariants({ size: "lg" })}
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
        className={buttonVariants({ size: "lg" })}
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
  if (product.visual.kind === "screenshots") {
    return (
      <Image
        alt=""
        className={cn(compact ? "size-7 rounded-md" : "size-8 rounded-lg")}
        // Intrinsic size is pinned at 2x the largest rendered box rather than
        // the source dimensions, so the optimizer never ships a 512px logo.
        height={64}
        src={product.visual.logo.src}
        width={64}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-foreground text-background shadow-sm",
        compact ? "size-7 rounded-md" : "size-8 rounded-lg"
      )}
    >
      <span
        className={cn(
          "font-heading leading-none font-semibold",
          compact ? "text-sm" : "text-base"
        )}
      >
        {product.visual.markLabel}
      </span>
    </span>
  )
}
