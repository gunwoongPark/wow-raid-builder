import axios from "axios"
import { NextResponse } from "next/server"

import { type RaiderIOProfile } from "@/entities/character"
import { toRealmSlug } from "@/shared/config/realms"
import { CURRENT_SEASON } from "@/shared/config/season"
import { handleRouteError } from "@/shared/lib/api-error"

interface Params {
  realm: string
  name: string
}

const RAIDERIO_BASE = "https://raider.io/api/v1"

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  try {
    const { name, realm } = await params
    const realmSlug = toRealmSlug(realm)

    const { data } = await axios.get<RaiderIOProfile>(`${RAIDERIO_BASE}/characters/profile`, {
      params: {
        fields: `mythic_plus_scores_by_season:${CURRENT_SEASON},raid_progression`,
        name,
        realm: realmSlug,
        region: "kr",
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    return handleRouteError(error)
  }
}
