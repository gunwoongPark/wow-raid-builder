import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"

import { type RaiderIOProfile } from "@/entities/character"

export interface CharacterSearchResult {
  className: string
  name: string
  realm: string
  realmSlug: string
  score: number
  specName: string
  thumbnailUrl: string
}

const KR_REALM_SLUGS = [
  "zuljin",
  "azshara",
  "hellscream",
  "hyjal",
  "durotan",
  "malfurion",
  "windrunner",
  "dalaran",
  "rexxar",
  "cenarius",
  "garona",
  "guldan",
  "stormrage",
  "deathwing",
]

const RAIDERIO_BASE = "https://raider.io/api/v1"
const CURRENT_SEASON = "season-mn-1"

const searchOnRealm = async (
  name: string,
  realmSlug: string
): Promise<CharacterSearchResult | null> => {
  try {
    // axios params 직렬화 시 한글이 깨지므로 URL을 직접 구성
    const url =
      `${RAIDERIO_BASE}/characters/profile` +
      `?region=kr` +
      `&realm=${encodeURIComponent(realmSlug)}` +
      `&name=${encodeURIComponent(name)}` +
      `&fields=mythic_plus_scores_by_season:${CURRENT_SEASON}`

    const { data } = await axios.get<RaiderIOProfile>(url, { timeout: 4000 })

    return {
      className: data.class,
      name: data.name,
      realm: data.realm,
      realmSlug,
      score: data.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
      specName: data.active_spec_name,
      thumbnailUrl: data.thumbnail_url,
    }
  } catch {
    return null
  }
}

export const GET = async (req: NextRequest) => {
  const name = req.nextUrl.searchParams.get("name")?.trim()

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "name은 2자 이상이어야 합니다.", status: 400 },
      { status: 400 }
    )
  }

  const results = await Promise.all(KR_REALM_SLUGS.map((slug) => searchOnRealm(name, slug)))
  const found = results.filter((r): r is CharacterSearchResult => r !== null)

  return NextResponse.json(found)
}
