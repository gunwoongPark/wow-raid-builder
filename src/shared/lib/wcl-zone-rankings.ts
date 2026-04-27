import { isArray, isNumber, isPlainObject } from "lodash-es"

import { type WCLZoneRankings } from "@/entities/character"
import { CURRENT_WCL_ZONE_ID } from "@/shared/config/season"

export const ZONE_RANKINGS_QUERY = `
  query CharacterZoneRankings($name: String!, $serverSlug: String!, $serverRegion: String!) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        heroic: zoneRankings(zoneID: ${CURRENT_WCL_ZONE_ID}, difficulty: 4)
        mythic: zoneRankings(zoneID: ${CURRENT_WCL_ZONE_ID}, difficulty: 5)
      }
    }
  }
`

/** WCL JSON scalar를 타입 안전하게 변환 */
export const parseZoneRankings = (raw: unknown): WCLZoneRankings | null => {
  if (!isPlainObject(raw)) return null
  const rawRecord = raw as Record<string, unknown>

  return {
    bestPerformanceAverage: isNumber(rawRecord.bestPerformanceAverage)
      ? rawRecord.bestPerformanceAverage
      : null,
    medianPerformanceAverage: isNumber(rawRecord.medianPerformanceAverage)
      ? rawRecord.medianPerformanceAverage
      : null,
    rankings: isArray(rawRecord.rankings) ? rawRecord.rankings : [],
  }
}
