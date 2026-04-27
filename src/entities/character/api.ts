import { type CharacterSearchResult } from "@/app/api/character/search/route"
import { apiClient } from "@/shared/api/axios"

import { type RaiderIOProfile, type RosterCharacter, type RosterCharacterWCL } from "./types"

export const characterApi = {
  getRaiderIO: async (realm: string, name: string): Promise<RaiderIOProfile> => {
    const { data } = await apiClient.get<RaiderIOProfile>(
      `/raiderio/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`
    )
    return data
  },

  getSummary: async (realm: string, name: string): Promise<RosterCharacter> => {
    const { data } = await apiClient.get<RosterCharacter>(
      `/character/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`
    )
    return data
  },

  getWarcraftLogs: async (realm: string, name: string): Promise<RosterCharacterWCL | null> => {
    const { data } = await apiClient.get<RosterCharacterWCL | null>(
      `/warcraftlogs/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`
    )
    return data
  },

  search: async (name: string): Promise<CharacterSearchResult[]> => {
    const { data } = await apiClient.get<CharacterSearchResult[]>("/character/search", {
      params: { name },
    })
    return data
  },
}
