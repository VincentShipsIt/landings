import { openFocusLanding } from "@workspace/landing"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"

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
  applicationName: openFocusLanding.name,
  title: `${openFocusLanding.name} - ${openFocusLanding.description}`,
  description: openFocusLanding.metaDescription,
  metadataBase: new URL(`https://${openFocusLanding.domain}`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: openFocusLanding.name,
    description: openFocusLanding.metaDescription,
    url: `https://${openFocusLanding.domain}`,
    siteName: openFocusLanding.name,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OpenFocus — your day, already in focus.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: openFocusLanding.name,
    description: openFocusLanding.metaDescription,
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
