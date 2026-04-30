import type { MetadataRoute } from "next"

const manifest = (): MetadataRoute.Manifest => ({
  background_color: "#0a0e1a",
  description: "공대장을 위한 공격대 구성 분석 도구",
  display: "standalone",
  icons: [
    { purpose: "maskable", sizes: "192x192", src: "/favicon.ico", type: "image/x-icon" },
    { purpose: "any", sizes: "512x512", src: "/favicon.ico", type: "image/x-icon" },
  ],
  name: "WoW Raid Builder",
  orientation: "portrait",
  short_name: "Raid Builder",
  start_url: "/",
  theme_color: "#c9a84c",
})

export default manifest
