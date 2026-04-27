import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "render.worldofwarcraft.com",
        pathname: "/kr/**",
        protocol: "https",
      },
      {
        hostname: "cdnassets.raider.io",
        protocol: "https",
      },
    ],
  },
}

export default nextConfig
