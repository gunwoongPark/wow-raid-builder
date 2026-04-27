import { apiClient } from "@/shared/api/axios"

import { type GuildRoster } from "./types"

export const guildApi = {
  getMembers: async (realm: string, guildName: string): Promise<GuildRoster> => {
    const { data } = await apiClient.get<GuildRoster>(
      `/guild/${encodeURIComponent(realm)}/${encodeURIComponent(guildName)}/members`
    )
    return data
  },
}
