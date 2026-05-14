import type { MetadataRoute } from "next"

const manifest = (): MetadataRoute.Manifest => ({
  background_color: "#0a0e1a",
  description: "공대장을 위한 공격대 구성 분석 도구",
  display: "standalone",
  icons: [
    { purpose: "any", sizes: "32x32", src: "/icon", type: "image/png" },
    { purpose: "maskable", sizes: "180x180", src: "/apple-icon", type: "image/png" },
  ],
  name: "RaidCraft",
  orientation: "portrait",
  short_name: "RaidCraft",
  start_url: "/",
  theme_color: "#c9a84c",
})

export default manifest
