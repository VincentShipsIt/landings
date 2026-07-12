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
import { cn } from "@workspace/ui/lib/utils"
import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  Download,
  GitFork,
  Terminal,
} from "lucide-react"
import type { CSSProperties } from "react"

import { CopyPromptButton } from "./copy-prompt-button"
import type { LandingProduct } from "./types"

type LandingPageProps = {
  product: LandingProduct
}

export function LandingPage({ product }: LandingPageProps) {
  return (
    <main
      className="min-h-svh bg-background text-foreground"
      style={
        {
          "--product-accent": product.accent,
          "--product-accent-soft": product.accentSoft,
        } as CSSProperties
      }
    >
      <SiteHeader product={product} />
      <Hero product={product} />
      <FeatureSection product={product} />
      <InstallSection product={product} />
      <SiteFooter product={product} />
    </main>
  )
}

function SiteHeader({ product }: LandingPageProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a className="flex items-center gap-3" href="#">
          <img alt="" className="size-8 rounded-lg" src={product.visual.logo} />
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
            href="#install"
          >
            Install
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href={product.repoUrl}
          >
            Source
          </a>
        </nav>
        <a
          className={cn(buttonVariants({ size: "sm" }))}
          href={product.downloadUrl}
        >
          {product.primaryCta}
          <ArrowUpRight data-icon="inline-end" />
        </a>
      </div>
    </header>
  )
}

function Hero({ product }: LandingPageProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-2">
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className={cn(buttonVariants({ size: "lg" }))}
              href={product.downloadUrl}
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
          </div>
        </div>
        <ProductVisual product={product} />
      </div>
    </section>
  )
}

function ProductVisual({ product }: LandingPageProps) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-10 h-40 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--product-accent-soft)" }}
      />
      <div className="relative grid gap-4">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <img
            alt={product.visual.primaryAlt}
            className="aspect-[16/10] w-full object-cover"
            src={product.visual.primaryImage}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <img
              alt={product.visual.secondaryAlt}
              className="aspect-[4/3] w-full object-cover"
              src={product.visual.secondaryImage}
            />
          </div>
          <div className="flex min-h-40 flex-col justify-between rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: "var(--product-accent)" }}
              />
              {product.domain}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>
        {product.visual.tertiaryImage ? (
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm lg:hidden">
            <img
              alt={product.visual.tertiaryAlt ?? ""}
              className="aspect-[16/10] w-full object-cover"
              src={product.visual.tertiaryImage}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function FeatureSection({ product }: LandingPageProps) {
  return (
    <section id="features" className="border-t bg-muted/30 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            Built like a utility, distributed like open source.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The page is intentionally straightforward: show the product, link
            the source, and make installation obvious.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

function InstallSection({ product }: LandingPageProps) {
  return (
    <section id="install" className="py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
            Install from the repo. Fork if useful.
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            These are distribution pages, not a funnel. The app stays useful as
            proof of taste, shipping cadence, and open-source surface area.
          </p>
          <div className="flex flex-col gap-3">
            {product.installNotes.map((note) => (
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
        <Card className="rounded-lg *:rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Download className="size-4" aria-hidden="true" />
              Direct download
            </div>
            <CardDescription>
              Signed and notarized. Drag to Applications, done.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className={cn(buttonVariants({ size: "lg" }))}
                href={product.downloadUrl}
              >
                <Download data-icon="inline-start" />
                {product.primaryCta}
              </a>
              <a
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" })
                )}
                href={product.releasesUrl}
              >
                All releases
                <ArrowUpRight data-icon="inline-end" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Terminal className="size-4" aria-hidden="true" />
              Prefer Homebrew?
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 dark:bg-zinc-900">
              <code>{product.installCommand}</code>
            </pre>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bot className="size-4" aria-hidden="true" />
              Using Claude Code or Codex?
            </div>
            <CopyPromptButton
              label="Copy prompt for your agent"
              text={product.agentPrompt}
            />
            <a
              className={cn(buttonVariants({ variant: "outline" }))}
              href={product.repoUrl}
            >
              <GitFork data-icon="inline-start" />
              GitHub
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function SiteFooter({ product }: LandingPageProps) {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img alt="" className="size-7 rounded-md" src={product.visual.logo} />
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
