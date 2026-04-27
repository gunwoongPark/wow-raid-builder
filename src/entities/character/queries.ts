import { queryOptions } from "@tanstack/react-query"

import { characterKeys } from "@/shared/lib/query-keys"

import { characterApi } from "./api"

export const characterQueries = {
  raiderIO: (realm: string, name: string) =>
    queryOptions({
      ...characterKeys.raiderIO(realm, name),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getRaiderIO(realm, name),
      staleTime: 5 * 60 * 1000,
    }),

  search: (name: string) =>
    queryOptions({
      ...characterKeys.search(name),
      enabled: name.length >= 2,
      queryFn: () => characterApi.search(name),
      staleTime: 30 * 1000,
    }),

  summary: (realm: string, name: string) =>
    queryOptions({
      ...characterKeys.summary(realm, name),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getSummary(realm, name),
      staleTime: 5 * 60 * 1000,
    }),
}
