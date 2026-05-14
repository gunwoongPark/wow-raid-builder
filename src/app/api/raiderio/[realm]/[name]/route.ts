import axios from "axios"
import { NextResponse } from "next/server"

import { type RaiderIOProfile } from "@/entities/character"
import { API_TIMEOUTS } from "@/shared/config/api-timeouts"
import { CACHE_HEADERS } from "@/shared/config/cache-headers"
import { RAIDERIO_BASE_URL } from "@/shared/config/raiderio"
import { toRealmSlug } from "@/shared/config/realms"
import { CURRENT_SEASON } from "@/shared/config/season"
import { handleRouteError } from "@/shared/lib/api-error"
import { characterParamSchema } from "@/shared/lib/route-param-schema"

interface Params {
  name: string
  realm: string
}

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  try {
    const raw = await params
    const parsed = characterParamSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: "잘못된 요청입니다.", status: 400 }, { status: 400 })
    }
    const { name, realm } = parsed.data
    const realmSlug = toRealmSlug(realm)

    const url =
      `${RAIDERIO_BASE_URL}/characters/profile` +
      `?region=kr` +
      `&realm=${encodeURIComponent(realmSlug)}` +
      `&name=${encodeURIComponent(name)}` +
      `&fields=mythic_plus_scores_by_season:${CURRENT_SEASON},raid_progression`

    const { data } = await axios.get<RaiderIOProfile>(url, {
      timeout: API_TIMEOUTS.RAIDERIO_PROFILE,
    })

    return NextResponse.json(data, {
      headers: { "Cache-Control": CACHE_HEADERS.RAIDERIO_PROFILE },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
