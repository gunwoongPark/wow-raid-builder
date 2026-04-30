import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://wow-raid-builder.vercel.app"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 1,
    url: BASE_URL,
  },
]

export default sitemap
