import type { MetadataRoute } from "next"

const manifest = (): MetadataRoute.Manifest => ({
  background_color: "#0a0e1a",
  description: "WoW raid composition analyzer for raid leaders",
  display: "standalone",
  icons: [
    { purpose: "any", sizes: "32x32", src: "/icon", type: "image/png" },
    { purpose: "maskable", sizes: "180x180", src: "/apple-icon", type: "image/png" },
  ],
  name: "Raid Scope",
  orientation: "portrait",
  short_name: "Raid Scope",
  start_url: "/",
  theme_color: "#c9a84c",
})

export default manifest
