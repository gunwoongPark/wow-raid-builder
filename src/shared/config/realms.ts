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

export const toRealmSlug = (input: string): string => {
  const trimmed = input.trim()
  return KR_REALM_SLUGS[trimmed] ?? trimmed.toLowerCase().replace(/\s+/g, "-")
}
