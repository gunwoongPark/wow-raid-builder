import axios from "axios"

import {
  buildRaiderIOProfile,
  getEnglishClassAndSpec,
  parseZoneRankings,
  type RaiderIOProfile,
  type RosterCharacter,
  type RosterCharacterWCL,
  SPEC_ROLE_MAP,
  ZONE_RANKINGS_QUERY,
} from "@/entities/character"
import { env } from "@/shared/config/env"
import { RAIDERIO_BASE_URL } from "@/shared/config/raiderio"
import { CURRENT_SEASON } from "@/shared/config/season"
import { WCL_GRAPHQL_URL } from "@/shared/config/warcraftlogs"
import { blizzardFetch } from "@/shared/lib/blizzard-fetch"
import { getWCLToken } from "@/shared/lib/wcl-token"
import { type BlizzardCharacterSummary } from "@/shared/types/blizzard"

import "server-only"

const fetchBlizzardSummary = async (realmSlug: string, name: string): Promise<RosterCharacter> => {
  const summary = await blizzardFetch<BlizzardCharacterSummary>(
    `/profile/wow/character/${encodeURIComponent(realmSlug)}/${encodeURIComponent(name.toLowerCase())}`,
    { namespace: "profile" }
  )
  const specId = summary.active_spec.id
  // Normalize to English: Blizzard KR API returns localized names without a locale param
  const { className, specName } = getEnglishClassAndSpec(
    specId,
    summary.character_class.name,
    summary.active_spec.name
  )

  return {
    classId: summary.character_class.id,
    className,
    faction: summary.faction.type.toLowerCase() as "alliance" | "horde",
    id: `${realmSlug}-${name.toLowerCase()}`,
    itemLevel: summary.equipped_item_level,
    name: summary.name,
    raiderIO: null,
    realm: summary.realm.name,
    role: SPEC_ROLE_MAP[specId] ?? "MELEE",
    specId,
    specName,
    warcraftLogs: null,
  }
}

const fetchRaiderIODirect = async (
  realmSlug: string,
  name: string
): Promise<RaiderIOProfile | null> => {
  try {
    const { data } = await axios.get<RaiderIOProfile>(`${RAIDERIO_BASE_URL}/characters/profile`, {
      params: {
        fields: `mythic_plus_scores_by_season:${CURRENT_SEASON},raid_progression`,
        name,
        realm: realmSlug,
        region: "kr",
      },
      timeout: 5000,
    })
    return data
  } catch {
    return null
  }
}

const fetchWCLDirect = async (
  realmSlug: string,
  name: string
): Promise<RosterCharacterWCL | null> => {
  if (!env.warcraftLogs.clientId || !env.warcraftLogs.clientSecret) return null
  try {
    const token = await getWCLToken()
    const { data } = await axios.post(
      WCL_GRAPHQL_URL,
      {
        query: ZONE_RANKINGS_QUERY,
        variables: { name, serverRegion: "kr", serverSlug: realmSlug },
      },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 }
    )
    const characterData = data.data?.characterData?.character
    if (!characterData) return null
    return {
      heroic: parseZoneRankings(characterData.heroic),
      mythic: parseZoneRankings(characterData.mythic),
    }
  } catch {
    return null
  }
}

/** Route Handler를 거치지 않고 외부 API를 서버에서 직접 호출 */
export const fetchCharacterOnServer = async (
  realmSlug: string,
  name: string
): Promise<RosterCharacter | null> => {
  const [characterResult, raiderIOResult, wclResult] = await Promise.allSettled([
    fetchBlizzardSummary(realmSlug, name),
    fetchRaiderIODirect(realmSlug, name),
    fetchWCLDirect(realmSlug, name),
  ])

  if (characterResult.status === "rejected") return null

  return {
    ...characterResult.value,
    raiderIO:
      raiderIOResult.status === "fulfilled" && raiderIOResult.value
        ? buildRaiderIOProfile(raiderIOResult.value)
        : null,
    warcraftLogs: wclResult.status === "fulfilled" ? wclResult.value : null,
  }
}
