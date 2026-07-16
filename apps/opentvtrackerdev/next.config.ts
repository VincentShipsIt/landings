import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/landing"],
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ]
  },
}

export default nextConfig
