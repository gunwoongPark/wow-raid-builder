import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"

import {
  type CharacterSearchResult,
  getSpecIdByClassAndName,
  type RaiderIOProfile,
} from "@/entities/character"
import { API_TIMEOUTS } from "@/shared/config/api-timeouts"
import { RAIDERIO_BASE_URL } from "@/shared/config/raiderio"
import { KR_SEARCH_REALM_SLUGS, US_SEARCH_REALM_SLUGS } from "@/shared/config/realms"
import { CURRENT_SEASON } from "@/shared/config/season"
import { handleRouteError } from "@/shared/lib/api-error"
import { regionQuerySchema } from "@/shared/lib/route-param-schema"

const searchOnRealm = async (
  name: string,
  realmSlug: string,
  region: string
): Promise<CharacterSearchResult | null> => {
  try {
    // axios params 직렬화 시 한글이 깨지므로 URL을 직접 구성
    const url =
      `${RAIDERIO_BASE_URL}/characters/profile` +
      `?region=${region}` +
      `&realm=${encodeURIComponent(realmSlug)}` +
      `&name=${encodeURIComponent(name)}` +
      `&fields=mythic_plus_scores_by_season:${CURRENT_SEASON},raid_progression`

    const { data } = await axios.get<RaiderIOProfile>(url, {
      timeout: API_TIMEOUTS.RAIDERIO_SEARCH,
    })

    const raidProgression = data.raid_progression ? Object.values(data.raid_progression)[0] : null

    return {
      className: data.class,
      heroicKills: raidProgression?.heroic_bosses_killed ?? null,
      mythicKills: raidProgression?.mythic_bosses_killed ?? null,
      name: data.name,
      realm: data.realm,
      realmSlug,
      score: data.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
      specId: getSpecIdByClassAndName(data.class, data.active_spec_name),
      specName: data.active_spec_name,
      thumbnailUrl: data.thumbnail_url,
      totalBosses: raidProgression?.total_bosses ?? null,
    }
  } catch {
    return null
  }
}

export const GET = async (request: NextRequest) => {
  try {
    const name = request.nextUrl.searchParams.get("name")?.trim()

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "name은 2자 이상이어야 합니다.", status: 400 },
        { status: 400 }
      )
    }

    const { region } = regionQuerySchema.parse({
      region: request.nextUrl.searchParams.get("region") ?? undefined,
    })

    const realmSlugs = region === "us" ? US_SEARCH_REALM_SLUGS : KR_SEARCH_REALM_SLUGS

    const results = await Promise.all(realmSlugs.map((slug) => searchOnRealm(name, slug, region)))
    const found = results.filter((result): result is CharacterSearchResult => result !== null)

    return NextResponse.json(found)
  } catch (error) {
    return handleRouteError(error)
  }
}
