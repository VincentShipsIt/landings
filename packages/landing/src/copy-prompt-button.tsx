"use client"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type CopyPromptButtonProps = {
  label: string
  text: string
}

export function CopyPromptButton({ label, text }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied; leave the label unchanged.
    }
  }

  return (
    <button
      className={cn(buttonVariants({ variant: "outline" }))}
      onClick={copy}
      type="button"
    >
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {copied ? "Copied" : label}
    </button>
  )
}
