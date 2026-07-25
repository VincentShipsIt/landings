import { createLandingSitemap, meterBarLanding } from "@workspace/landing"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return createLandingSitemap(meterBarLanding)
}
