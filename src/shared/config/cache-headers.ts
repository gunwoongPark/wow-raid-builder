export const CACHE_HEADERS = {
  CHARACTER_SUMMARY: "public, max-age=300, stale-while-revalidate=600",
  RAIDERIO_PROFILE: "public, max-age=300, stale-while-revalidate=600",
  WCL_DATA: "public, max-age=600, stale-while-revalidate=1200",
} as const
