import type { MetadataRoute } from "next"

import { SITE_URL } from "@/shared/config/site"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "monthly",
    lastModified: new Date("2025-05-06"),
    priority: 1,
    url: SITE_URL,
  },
]

export default sitemap
