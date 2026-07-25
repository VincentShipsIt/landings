import {
  createLandingMetadata,
  LandingRootLayout,
  meterBarLanding,
} from "@workspace/landing"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { Geist, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"

// next/font must be loaded from the app that owns the build, so the faces stay
// here while the rest of the shell comes from the shared layout.
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-body",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
})

export const metadata = createLandingMetadata(meterBarLanding)

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <LandingRootLayout fontClassName={cn(sans.variable, mono.variable)}>
      {children}
    </LandingRootLayout>
  )
}
