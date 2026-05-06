import type { MetadataRoute } from "next"

import { SITE_RELEASE_DATE, SITE_URL } from "@/shared/config/site"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "monthly",
    lastModified: SITE_RELEASE_DATE,
    priority: 1,
    url: SITE_URL,
  },
]

export default sitemap
