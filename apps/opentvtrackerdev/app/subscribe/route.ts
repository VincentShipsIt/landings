import { handleSubscribe, openTVTrackerLanding } from "@workspace/landing"

export function POST(request: Request) {
  return handleSubscribe(request, openTVTrackerLanding)
}
