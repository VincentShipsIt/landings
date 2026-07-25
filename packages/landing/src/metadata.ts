import type { Metadata, MetadataRoute } from "next"

import type { LandingProduct } from "./types"

/**
 * Single source of metadata for every landing app. Products differ only in the
 * OG image they point at, which `product.ogImage` carries.
 */
export function createLandingMetadata(product: LandingProduct): Metadata {
  const url = `https://${product.domain}`

  return {
    alternates: { canonical: "/" },
    applicationName: product.name,
    description: product.metaDescription,
    metadataBase: new URL(url),
    openGraph: {
      description: product.metaDescription,
      images: [
        {
          alt: product.ogImage.alt,
          height: product.ogImage.height,
          url: product.ogImage.src,
          width: product.ogImage.width,
        },
      ],
      siteName: product.name,
      title: product.name,
      type: "website",
      url,
    },
    title: `${product.name} - ${product.description}`,
    twitter: {
      card: "summary_large_image",
      description: product.metaDescription,
      images: [product.ogImage.src],
      title: product.name,
    },
  }
}

export function createLandingSitemap(
  product: LandingProduct
): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
      url: `https://${product.domain}/`,
    },
  ]
}

export function createLandingRobots(
  product: LandingProduct
): MetadataRoute.Robots {
  return {
    // `/download` is a redirect, not a page; keeping crawlers off it avoids
    // burning GitHub API quota on bot traffic.
    rules: [{ allow: "/", disallow: "/download", userAgent: "*" }],
    sitemap: `https://${product.domain}/sitemap.xml`,
  }
}
