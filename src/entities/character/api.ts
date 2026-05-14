import { apiClient } from "@/shared/api/axios"
import { type GameRegion } from "@/shared/config/region"

import {
  type CharacterSearchResult,
  type RaiderIOProfile,
  type RosterCharacter,
  type RosterCharacterRaiderIO,
  type RosterCharacterWCL,
} from "./types"

export const buildRaiderIOProfile = (data: RaiderIOProfile): RosterCharacterRaiderIO => ({
  profileUrl: data.profile_url,
  raidProgression: data.raid_progression ?? {},
  score: data.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
  thumbnailUrl: data.thumbnail_url,
})

export const characterApi = {
  getRaiderIO: async (
    realm: string,
    name: string,
    region: GameRegion
  ): Promise<RaiderIOProfile> => {
    const { data } = await apiClient.get<RaiderIOProfile>(
      `/raiderio/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`,
      { params: { region } }
    )
    return data
  },

  getSummary: async (realm: string, name: string, region: GameRegion): Promise<RosterCharacter> => {
    const { data } = await apiClient.get<RosterCharacter>(
      `/character/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`,
      { params: { region } }
    )
    return data
  },

  getWarcraftLogs: async (
    realm: string,
    name: string,
    region: GameRegion
  ): Promise<RosterCharacterWCL | null> => {
    const { data } = await apiClient.get<RosterCharacterWCL | null>(
      `/warcraftlogs/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`,
      { params: { region } }
    )
    return data
  },

  search: async (name: string, region: GameRegion): Promise<CharacterSearchResult[]> => {
    const { data } = await apiClient.get<CharacterSearchResult[]>("/character/search", {
      params: { name, region },
    })
    return data
  },
}
