export type GameRegion = "kr" | "us"

interface RegionConfig {
  apiBaseUrl: string
  locale: string
  namespace: { dynamic: string; profile: string; static: string }
  oauthBaseUrl: string
  raiderIORegion: string
  wclServerRegion: string
}

export const REGION_CONFIG = {
  kr: {
    apiBaseUrl: "https://kr.api.blizzard.com",
    locale: "ko_KR",
    namespace: { dynamic: "dynamic-kr", profile: "profile-kr", static: "static-kr" },
    oauthBaseUrl: "https://kr.battle.net",
    raiderIORegion: "kr",
    wclServerRegion: "kr",
  },
  us: {
    apiBaseUrl: "https://us.api.blizzard.com",
    locale: "en_US",
    namespace: { dynamic: "dynamic-us", profile: "profile-us", static: "static-us" },
    oauthBaseUrl: "https://us.battle.net",
    raiderIORegion: "us",
    wclServerRegion: "us",
  },
} satisfies Record<GameRegion, RegionConfig>

export const LOCALE_TO_REGION: Record<string, GameRegion> = {
  en: "us",
  ko: "kr",
}

export const localeToRegion = (locale: string): GameRegion => LOCALE_TO_REGION[locale] ?? "kr"
