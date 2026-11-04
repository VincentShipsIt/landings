"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/** How long a button keeps showing its "copied" state. */
const COPIED_RESET_MS = 2000

/**
 * Copy-to-clipboard state shared by every copy button. `copied` flips on after
 * a successful write and resets itself; a denied clipboard leaves the button
 * untouched rather than reporting a copy that did not happen.
 */
export function useCopyToClipboard(text: string) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      // Clipboard access denied; leave the button unchanged.
    }
  }, [text])

  return { copied, copy }
}
