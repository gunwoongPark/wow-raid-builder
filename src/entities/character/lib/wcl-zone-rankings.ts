import { isArray, isNumber, isPlainObject } from "lodash-es"

import { CURRENT_WCL_ZONE_ID } from "@/shared/config/season"

import { type WCLZoneRankings } from "../types"

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

const isRecord = (value: unknown): value is Record<string, unknown> => isPlainObject(value)

/** WCL JSON scalar를 타입 안전하게 변환 */
export const parseZoneRankings = (raw: unknown): WCLZoneRankings | null => {
  if (!isRecord(raw)) return null

  return {
    bestPerformanceAverage: isNumber(raw.bestPerformanceAverage)
      ? raw.bestPerformanceAverage
      : null,
    medianPerformanceAverage: isNumber(raw.medianPerformanceAverage)
      ? raw.medianPerformanceAverage
      : null,
    rankings: isArray(raw.rankings) ? raw.rankings : [],
  }
}
