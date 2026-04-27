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
const CURRENT_ZONE_ID = 43

const ZONE_RANKINGS_QUERY = `
  query CharacterZoneRankings($name: String!, $serverSlug: String!, $serverRegion: String!) {
    characterData {
      character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
        zoneRankings(zoneID: ${CURRENT_ZONE_ID})
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

    const zoneRankings = data.data?.characterData?.character?.zoneRankings
    if (!zoneRankings) return NextResponse.json(null)

    const result: RosterCharacterWCL = {
      bestParseAvg: zoneRankings.bestPerformanceAverage ?? null,
      medianParseAvg: zoneRankings.medianPerformanceAverage ?? null,
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
