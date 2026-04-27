import { apiClient } from "@/shared/api/axios"

import { type Guild } from "./types"

export const guildApi = {
  getMembers: async (realm: string, guildName: string): Promise<Guild> => {
    const { data } = await apiClient.get<Guild>(
      `/guild/${encodeURIComponent(realm)}/${encodeURIComponent(guildName)}/members`
    )
    return data
  },
}
