import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

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
  reactCompiler: true,
}

export default withNextIntl(nextConfig)
