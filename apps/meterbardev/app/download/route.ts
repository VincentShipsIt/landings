import { meterBarLanding, redirectToLatestRelease } from "@workspace/landing"

export function GET(request: Request) {
  return redirectToLatestRelease(request, meterBarLanding)
}
