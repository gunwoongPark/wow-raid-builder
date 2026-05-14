import type { MetadataRoute } from "next"

import { SITE_LAST_MODIFIED, SITE_URL } from "@/shared/config/site"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        "ko-KR": SITE_URL,
        "x-default": SITE_URL,
      },
    },
    changeFrequency: "weekly",
    lastModified: SITE_LAST_MODIFIED,
    priority: 1,
    url: SITE_URL,
  },
  {
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        "ko-KR": SITE_URL,
        "x-default": SITE_URL,
      },
    },
    changeFrequency: "weekly",
    lastModified: SITE_LAST_MODIFIED,
    priority: 0.9,
    url: `${SITE_URL}/en`,
  },
]

export default sitemap
