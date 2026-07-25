import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import type { ReactNode } from "react"

type LandingRootLayoutProps = {
  children: ReactNode
  /**
   * Concatenated `next/font` variable classes. Fonts stay in each app because
   * next/font has to be loaded from the package that owns the build.
   */
  fontClassName: string
}

export function LandingRootLayout({
  children,
  fontClassName,
}: LandingRootLayoutProps) {
  return (
    <html
      className={cn("antialiased", fontClassName, "font-sans")}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
