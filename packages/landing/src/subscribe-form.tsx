"use client"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Loader2 } from "lucide-react"
import type { FormEvent } from "react"
import { useId, useState } from "react"

import { PRIMARY_CTA_CLASS } from "./cta"
import type { LandingSubscribe } from "./types"

type SubscribeFormProps = {
  copy: LandingSubscribe
}

type Status = "error" | "idle" | "sending" | "sent"

export function SubscribeForm({ copy }: SubscribeFormProps) {
  const inputId = useId()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (status === "sending") return

    setStatus("sending")
    setMessage("")

    try {
      const response = await fetch("/subscribe", {
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null

        setMessage(payload?.error ?? "Something went wrong. Try again.")
        setStatus("error")

        return
      }

      setEmail("")
      setStatus("sent")
    } catch {
      setMessage("Network error. Try again.")
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <p className="flex items-center gap-2 text-sm font-medium">
        <Check
          className="size-4 text-[var(--product-accent-ink)]"
          aria-hidden="true"
        />
        {copy.successMessage}
      </p>
    )
  }

  return (
    <form className="flex flex-col gap-3" noValidate onSubmit={submit}>
      <label className="sr-only" htmlFor={inputId}>
        {copy.heading}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          autoComplete="email"
          className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-3 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          id={inputId}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          required
          type="email"
          value={email}
        />
        <button
          className={cn(buttonVariants({ size: "lg" }), PRIMARY_CTA_CLASS)}
          disabled={status === "sending"}
          type="submit"
        >
          {status === "sending" ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : null}
          {copy.buttonLabel}
        </button>
      </div>
      <p
        aria-live="polite"
        className={cn(
          "text-xs",
          status === "error" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {status === "error" ? message : copy.description}
      </p>
    </form>
  )
}
