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
      {
        hostname: "kr.battle.net",
        protocol: "https",
      },
      {
        hostname: "wow.zamimg.com",
        pathname: "/images/wow/icons/**",
        protocol: "https",
      },
    ],
  },
}

export default nextConfig
