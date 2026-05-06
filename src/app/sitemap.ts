import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://wow-raid-builder.vercel.app"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "monthly",
    lastModified: new Date("2025-05-06"),
    priority: 1,
    url: BASE_URL,
  },
]

export default sitemap
