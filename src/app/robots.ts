import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://wow-raid-builder.vercel.app"

const robots = (): MetadataRoute.Robots => ({
  rules: {
    allow: "/",
    disallow: "/api/",
    userAgent: "*",
  },
  sitemap: `${BASE_URL}/sitemap.xml`,
})

export default robots
