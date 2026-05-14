// 한국 WoW 서버 한글명 → Blizzard API slug 매핑
export const KR_REALM_SLUGS: Record<string, string> = {
  가로나: "garona",
  굴단: "guldan",
  노르간논: "norgannon",
  달라란: "dalaran",
  데스윙: "deathwing",
  듀로탄: "durotan",
  렉사르: "rexxar",
  말퓨리온: "malfurion",
  매디빈: "medivh",
  세나리우스: "cenarius",
  스톰레이지: "stormrage",
  아즈샤라: "azshara",
  알렉스트라자: "alexstrasza",
  와일드해머: "wildhammer",
  윈드러너: "windrunner",
  줄진: "zuljin",
  하이잘: "hyjal",
  헬스크림: "hellscream",
}

// Raider.IO 캐릭터 검색 시 순회할 활성 KR 서버 slug 목록
export const KR_SEARCH_REALM_SLUGS = [
  "zuljin",
  "azshara",
  "hellscream",
  "hyjal",
  "durotan",
  "malfurion",
  "windrunner",
  "dalaran",
  "rexxar",
  "cenarius",
  "garona",
  "guldan",
  "stormrage",
  "deathwing",
] as const

export const US_SEARCH_REALM_SLUGS = [
  "area-52",
  "illidan",
  "tichondrius",
  "stormrage",
  "mal-ganis",
  "thrall",
  "bleeding-hollow",
  "kelthuzad",
  "sargeras",
  "emerald-dream",
  "darkspear",
  "kil-jaeden",
  "moonguard",
  "wyrmrest-accord",
  "zul-jin",
] as const

export const toRealmSlug = (input: string): string => {
  const trimmed = input.trim()
  return KR_REALM_SLUGS[trimmed] ?? trimmed.toLowerCase().replace(/\s+/g, "-")
}
