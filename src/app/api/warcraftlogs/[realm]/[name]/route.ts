import axios from "axios"
import { NextResponse } from "next/server"

import { type RosterCharacterWCL } from "@/entities/character"
import { env } from "@/shared/config/env"
import { toRealmSlug } from "@/shared/config/realms"
import { handleRouteError } from "@/shared/lib/api-error"
import { getWCLToken } from "@/shared/lib/wcl-token"

interface Params {
  name: string
  realm: string
}

const WCL_GRAPHQL = "https://www.warcraftlogs.com/api/v2/client"

// Liberation of Undermine — TWW 시즌 2 레이드
// 시즌 변경 시 WCL zone ID 업데이트 필요
// Liberation of Undermine — TWW 시즌 2 레이드
// difficulty: 4 = 영웅, 5 = 신화 — 시즌 변경 시 CURRENT_ZONE_ID 수정
const CURRENT_ZONE_ID = 43

// 영웅(4)과 신화(5)를 GraphQL 별칭으로 한 번에 조회
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
      heroic: char.heroic?.bestPerformanceAverage ?? null,
      mythic: char.mythic?.bestPerformanceAverage ?? null,
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
