import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Return to OpenTV Tracker",
  description: "Complete the OpenRouter connection in OpenTV Tracker.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function OpenRouterCallbackPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 text-foreground">
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <Image
          alt=""
          className="size-20 rounded-2xl"
          height={80}
          src="/product/logo.png"
          width={80}
        />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.035em]">
            Return to OpenTV Tracker
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            OpenTV should resume the OpenRouter connection automatically. If
            this page stayed open, return to the app on your iPhone.
          </p>
        </div>
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/">
          Visit opentvtracker.dev
        </Link>
      </div>
    </main>
  )
}
