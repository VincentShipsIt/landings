import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import { macSweepLanding } from "@workspace/landing"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: `${macSweepLanding.name} - ${macSweepLanding.description}`,
  description: macSweepLanding.metaDescription,
  metadataBase: new URL(`https://${macSweepLanding.domain}`),
  openGraph: {
    title: macSweepLanding.name,
    description: macSweepLanding.metaDescription,
    url: `https://${macSweepLanding.domain}`,
    siteName: macSweepLanding.name,
    type: "website",
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
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
