import { queryOptions } from "@tanstack/react-query"

import { guildKeys } from "@/shared/lib/query-keys"

import { guildApi } from "./api"

export const guildQueries = {
  members: (realm: string, guildName: string) =>
    queryOptions({
      ...guildKeys.members(realm, guildName),
      enabled: Boolean(realm && guildName),
      queryFn: () => guildApi.getMembers(realm, guildName),
    }),
}
