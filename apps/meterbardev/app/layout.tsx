import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import { meterBarLanding } from "@workspace/landing"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const display = Geist({
  subsets: ["latin"],
  variable: "--font-display",
})

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
})

export const metadata: Metadata = {
  title: `${meterBarLanding.name} - ${meterBarLanding.description}`,
  description: meterBarLanding.metaDescription,
  metadataBase: new URL(`https://${meterBarLanding.domain}`),
  openGraph: {
    title: meterBarLanding.name,
    description: meterBarLanding.metaDescription,
    url: `https://${meterBarLanding.domain}`,
    siteName: meterBarLanding.name,
    type: "website",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "MeterBar — Know your limits.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: meterBarLanding.name,
    description: meterBarLanding.metaDescription,
    images: ["/og-card.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        display.variable,
        body.variable,
        mono.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
