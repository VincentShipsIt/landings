"use client"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Link2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type ProfileShareButtonsProps = {
  url: string
  text: string
}

/** Share row for a public profile: copy the link, or post it to X / LinkedIn. */
export function ProfileShareButtons({ text, url }: ProfileShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied; the link is still in the address bar.
    }
  }

  const x = new URL("https://x.com/intent/post")
  x.searchParams.set("text", text)
  x.searchParams.set("url", url)
  const linkedIn = new URL("https://www.linkedin.com/sharing/share-offsite/")
  linkedIn.searchParams.set("url", url)
  const style = buttonVariants({ size: "sm", variant: "outline" })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={cn(style)} onClick={copy} type="button">
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <a className={style} href={x.toString()} rel="noreferrer" target="_blank">
        Post to X
      </a>
      <a
        className={style}
        href={linkedIn.toString()}
        rel="noreferrer"
        target="_blank"
      >
        Share on LinkedIn
      </a>
    </div>
  )
}
