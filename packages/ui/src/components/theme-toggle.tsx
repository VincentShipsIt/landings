"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"

/**
 * Visible counterpart to the bare-"d" hotkey in ThemeProvider. Both icons are
 * rendered and swapped by the `dark` variant, so the markup is identical on the
 * server and the client — `next-themes` sets the class before paint, and no
 * mount guard is needed. `resolvedTheme` is only read inside the click handler,
 * which never runs during hydration.
 */
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      aria-label="Toggle theme"
      className={className}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon"
      title="Toggle theme (D)"
      variant="ghost"
    >
      <Sun aria-hidden="true" className="dark:hidden" />
      <Moon aria-hidden="true" className="hidden dark:block" />
    </Button>
  )
}

export { ThemeToggle }
