import type { LucideIcon } from "lucide-react"

export type LandingProduct = {
  name: string
  domain: string
  repoUrl: string
  downloadUrl: string
  installCommand: string
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
