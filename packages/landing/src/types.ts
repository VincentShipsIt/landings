import type { LucideIcon } from "lucide-react"

export type LandingProduct = {
  name: string
  domain: string
  repoUrl: string
  /** Primary download target, usually the platform-aware internal resolver. */
  downloadUrl: string
  /** All-releases page, linked as the secondary "all releases" action. */
  releasesUrl: string
  /** GitHub repository used to resolve the latest versioned release artifact. */
  releaseRepo: string
  /** Case-insensitive pattern identifying the supported macOS ZIP asset. */
  releaseAssetPattern: string
  installCommand: string
  /** Copyable instruction for coding agents (Claude Code, Codex) to install the app. */
  agentPrompt: string
  /** X (Twitter) profile URL, linked in the footer when set. */
  xUrl?: string
  accent: string
  accentSoft: string
  title: string
  description: string
  metaDescription: string
  heroCopy: string
  primaryCta: string
  secondaryCta: string
  visual: {
    logo: string
    primaryImage: string
    secondaryImage: string
    tertiaryImage?: string
    primaryAlt: string
    secondaryAlt: string
    tertiaryAlt?: string
  }
  proof: string[]
  features: Array<{
    title: string
    description: string
    icon: LucideIcon
  }>
  installNotes: string[]
  footerNote: string
}
