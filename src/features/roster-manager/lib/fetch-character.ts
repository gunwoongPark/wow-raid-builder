import { characterApi, type RaiderIOProfile, type RosterCharacter } from "@/entities/character"

const buildRaiderIO = (data: RaiderIOProfile) => ({
  profileUrl: data.profile_url,
  raidProgression: data.raid_progression ?? {},
  score: data.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
  thumbnailUrl: data.thumbnail_url,
})

/** 3개 API 병렬 조회 후 RosterCharacter 조립 — 새로고침·URL 로드 공용 */
export const fetchCharacter = async (
  realmSlug: string,
  name: string
): Promise<RosterCharacter | null> => {
  const [characterResult, raiderIOResult, warcraftLogsResult] = await Promise.allSettled([
    characterApi.getSummary(realmSlug, name),
    characterApi.getRaiderIO(realmSlug, name),
    characterApi.getWarcraftLogs(realmSlug, name),
  ])

  if (characterResult.status === "rejected") return null

  return {
    ...characterResult.value,
    raiderIO:
      raiderIOResult.status === "fulfilled" && raiderIOResult.value
        ? buildRaiderIO(raiderIOResult.value)
        : null,
    warcraftLogs: warcraftLogsResult.status === "fulfilled" ? warcraftLogsResult.value : null,
  }
}
