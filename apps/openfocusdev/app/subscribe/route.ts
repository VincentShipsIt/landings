import { handleSubscribe, openFocusLanding } from "@workspace/landing"

export function POST(request: Request) {
  return handleSubscribe(request, openFocusLanding)
}
