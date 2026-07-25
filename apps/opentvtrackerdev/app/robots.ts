import { createLandingRobots, openTVTrackerLanding } from "@workspace/landing"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return createLandingRobots(openTVTrackerLanding)
}
