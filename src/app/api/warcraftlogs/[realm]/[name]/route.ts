import axios from "axios"
import { NextResponse } from "next/server"

import { type RosterCharacterWCL, type WCLZoneRankings } from "@/entities/character"
import { env } from "@/shared/config/env"
import { toRealmSlug } from "@/shared/config/realms"
import { handleRouteError } from "@/shared/lib/api-error"
import { getWCLToken } from "@/shared/lib/wcl-token"

interface Params {
  name: string
  realm: string
}

const WCL_GRAPHQL = "https://www.warcraftlogs.com/api/v2/client"

// Liberation of Undermine — TWW 시즌 2 레이드 (difficulty: 4=영웅, 5=신화)
// 시즌 변경 시 CURRENT_ZONE_ID 업데이트 필요
const CURRENT_ZONE_ID = 43

// zoneRankings는 JSON scalar — rankings 배열에 보스별 상세가 포함됨
const ZONE_RANKINGS_QUERY = `
  query CharacterZoneRankings($name: String!, $serverSlug: String!, $serverRegion: String!) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        heroic: zoneRankings(zoneID: ${CURRENT_ZONE_ID}, difficulty: 4)
        mythic: zoneRankings(zoneID: ${CURRENT_ZONE_ID}, difficulty: 5)
      }
    }
  }
`

// WCL JSON scalar를 타입 안전하게 변환
const parseZoneRankings = (raw: unknown): WCLZoneRankings | null => {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>

  return {
    bestPerformanceAverage:
      typeof r.bestPerformanceAverage === "number" ? r.bestPerformanceAverage : null,
    medianPerformanceAverage:
      typeof r.medianPerformanceAverage === "number" ? r.medianPerformanceAverage : null,
    rankings: Array.isArray(r.rankings) ? r.rankings : [],
  }
}

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  if (!env.warcraftLogs.clientId || !env.warcraftLogs.clientSecret) {
    return NextResponse.json(null)
  }

  try {
    const { name, realm } = await params
    const token = await getWCLToken()
    const serverSlug = toRealmSlug(realm)

    const { data } = await axios.post(
      WCL_GRAPHQL,
      { query: ZONE_RANKINGS_QUERY, variables: { name, serverRegion: "kr", serverSlug } },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 }
    )

    const char = data.data?.characterData?.character
    if (!char) return NextResponse.json(null)

    const result: RosterCharacterWCL = {
      heroic: parseZoneRankings(char.heroic),
      mythic: parseZoneRankings(char.mythic),
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
