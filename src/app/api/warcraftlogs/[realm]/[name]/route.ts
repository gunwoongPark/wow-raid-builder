import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"

import {
  parseZoneRankings,
  type RosterCharacterWCL,
  ZONE_RANKINGS_QUERY,
} from "@/entities/character"
import { API_TIMEOUTS } from "@/shared/config/api-timeouts"
import { CACHE_HEADERS } from "@/shared/config/cache-headers"
import { env } from "@/shared/config/env"
import { toRealmSlug } from "@/shared/config/realms"
import { WCL_GRAPHQL_URL } from "@/shared/config/warcraftlogs"
import { handleRouteError } from "@/shared/lib/api-error"
import { characterParamSchema, regionQuerySchema } from "@/shared/lib/route-param-schema"
import { getWCLToken } from "@/shared/lib/wcl-token"

interface Params {
  name: string
  realm: string
}

export const GET = async (req: NextRequest, { params }: { params: Promise<Params> }) => {
  if (!env.warcraftLogs.clientId || !env.warcraftLogs.clientSecret) {
    return NextResponse.json(null)
  }

  try {
    const raw = await params
    const parsed = characterParamSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: "잘못된 요청입니다.", status: 400 }, { status: 400 })
    }
    const { name, realm } = parsed.data
    const serverSlug = toRealmSlug(realm)

    const { region } = regionQuerySchema.parse({
      region: req.nextUrl.searchParams.get("region") ?? undefined,
    })

    const token = await getWCLToken()
    const { data } = await axios.post(
      WCL_GRAPHQL_URL,
      { query: ZONE_RANKINGS_QUERY, variables: { name, serverRegion: region, serverSlug } },
      { headers: { Authorization: `Bearer ${token}` }, timeout: API_TIMEOUTS.WCL }
    )

    const characterData = data.data?.characterData?.character
    if (!characterData) return NextResponse.json(null)

    const result: RosterCharacterWCL = {
      heroic: parseZoneRankings(characterData.heroic),
      mythic: parseZoneRankings(characterData.mythic),
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": CACHE_HEADERS.WCL_DATA },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
