"use client"

import { Check, Copy } from "lucide-react"

import { useCopyToClipboard } from "./use-copy-to-clipboard"

type CopyCommandButtonProps = {
  command: string
}

/**
 * Hero install one-liner. Styled as a terminal chip rather than a button so it
 * reads as copyable text and does not compete with the two CTAs above it.
 */
export function CopyCommandButton({ command }: CopyCommandButtonProps) {
  const { copied, copy } = useCopyToClipboard(command)

  return (
    <button
      // The state swap is carried by an aria-hidden icon, so the accessible
      // name has to report it instead — otherwise the copy is silent to AT.
      aria-label={
        copied
          ? `Copied install command: ${command}`
          : `Copy install command: ${command}`
      }
      className="group flex min-w-0 items-center gap-2.5 rounded-lg border bg-muted/40 px-3.5 py-2.5 text-left transition-colors hover:bg-muted sm:max-w-md"
      onClick={copy}
      type="button"
    >
      <span aria-hidden="true" className="text-muted-foreground select-none">
        $
      </span>
      <code className="min-w-0 truncate font-mono text-xs text-foreground sm:text-sm">
        {command}
      </code>
      {copied ? (
        <Check
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      ) : (
        <Copy
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      )}
    </button>
  )
}
