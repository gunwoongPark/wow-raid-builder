import axios from "axios"
import { NextResponse } from "next/server"

import { type RaiderIOProfile } from "@/entities/character"
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

    const { data } = await axios.get<RaiderIOProfile>(`${RAIDERIO_BASE_URL}/characters/profile`, {
      params: {
        fields: `mythic_plus_scores_by_season:${CURRENT_SEASON},raid_progression`,
        name,
        realm: realmSlug,
        region: "kr",
      },
    })

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
