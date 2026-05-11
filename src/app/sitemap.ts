import type { MetadataRoute } from "next"

import { SITE_URL } from "@/shared/config/site"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 1,
    url: SITE_URL,
  },
]

export default sitemap
