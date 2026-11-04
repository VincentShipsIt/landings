"use client"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Copy } from "lucide-react"

import { useCopyToClipboard } from "./use-copy-to-clipboard"

type CopyPromptButtonProps = {
  label: string
  text: string
}

export function CopyPromptButton({ label, text }: CopyPromptButtonProps) {
  const { copied, copy } = useCopyToClipboard(text)

  return (
    <button
      className={cn(buttonVariants({ variant: "outline" }))}
      onClick={copy}
      type="button"
    >
      {copied ? (
        <Check aria-hidden="true" data-icon="inline-start" />
      ) : (
        <Copy aria-hidden="true" data-icon="inline-start" />
      )}
      {copied ? "Copied" : label}
    </button>
  )
}
