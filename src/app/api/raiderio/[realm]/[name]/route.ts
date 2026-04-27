import axios from "axios"
import { NextResponse } from "next/server"

import { type RaiderIOProfile } from "@/entities/character"

interface Params {
  realm: string
  name: string
}

const RAIDERIO_BASE = "https://raider.io/api/v1"
const CURRENT_SEASON = "season-tww-2"

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  const { name, realm } = await params

  const { data } = await axios.get<RaiderIOProfile>(`${RAIDERIO_BASE}/characters/profile`, {
    params: {
      fields: `mythic_plus_scores_by_season:${CURRENT_SEASON},raid_progression`,
      name,
      realm,
      region: "kr",
    },
  })

  return NextResponse.json(data)
}
