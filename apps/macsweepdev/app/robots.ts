import { createLandingRobots, macSweepLanding } from "@workspace/landing"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return createLandingRobots(macSweepLanding)
}
