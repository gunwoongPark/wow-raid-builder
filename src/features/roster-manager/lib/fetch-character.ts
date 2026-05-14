import { buildRaiderIOProfile, characterApi, type RosterCharacter } from "@/entities/character"
import { type GameRegion } from "@/shared/config/region"

/** 3개 API 병렬 조회 후 RosterCharacter 조립 — 새로고침·URL 로드 공용 */
export const fetchCharacter = async (
  realmSlug: string,
  name: string,
  region: GameRegion
): Promise<RosterCharacter | null> => {
  const [characterResult, raiderIOResult, warcraftLogsResult] = await Promise.allSettled([
    characterApi.getSummary(realmSlug, name, region),
    characterApi.getRaiderIO(realmSlug, name, region),
    characterApi.getWarcraftLogs(realmSlug, name, region),
  ])

  if (characterResult.status === "rejected") return null

  return {
    ...characterResult.value,
    raiderIO:
      raiderIOResult.status === "fulfilled" && raiderIOResult.value
        ? buildRaiderIOProfile(raiderIOResult.value)
        : null,
    warcraftLogs: warcraftLogsResult.status === "fulfilled" ? warcraftLogsResult.value : null,
  }
}
