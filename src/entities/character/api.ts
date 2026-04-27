import { apiClient } from "@/shared/api/axios"

import { type RaiderIOProfile, type RosterCharacter } from "./types"

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
}
