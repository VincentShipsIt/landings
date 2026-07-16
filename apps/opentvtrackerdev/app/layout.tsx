import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import { openTVTrackerLanding } from "@workspace/landing"
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
  applicationName: openTVTrackerLanding.name,
  title: `${openTVTrackerLanding.name} - ${openTVTrackerLanding.description}`,
  description: openTVTrackerLanding.metaDescription,
  metadataBase: new URL(`https://${openTVTrackerLanding.domain}`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: openTVTrackerLanding.name,
    description: openTVTrackerLanding.metaDescription,
    url: `https://${openTVTrackerLanding.domain}`,
    siteName: openTVTrackerLanding.name,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OpenTV Tracker — private TV tracking for one person or two.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: openTVTrackerLanding.name,
    description: openTVTrackerLanding.metaDescription,
    images: ["/opengraph-image"],
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
