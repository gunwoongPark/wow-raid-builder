import axios from "axios"
import { NextResponse } from "next/server"

import { type RosterCharacterWCL } from "@/entities/character"
import { env } from "@/shared/config/env"
import { toRealmSlug } from "@/shared/config/realms"
import { WCL_GRAPHQL_URL } from "@/shared/config/warcraftlogs"
import { handleRouteError } from "@/shared/lib/api-error"
import { getWCLToken } from "@/shared/lib/wcl-token"
import { parseZoneRankings, ZONE_RANKINGS_QUERY } from "@/shared/lib/wcl-zone-rankings"

interface Params {
  name: string
  realm: string
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
      WCL_GRAPHQL_URL,
      { query: ZONE_RANKINGS_QUERY, variables: { name, serverRegion: "kr", serverSlug } },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 }
    )

    const characterData = data.data?.characterData?.character
    if (!characterData) return NextResponse.json(null)

    const result: RosterCharacterWCL = {
      heroic: parseZoneRankings(characterData.heroic),
      mythic: parseZoneRankings(characterData.mythic),
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
