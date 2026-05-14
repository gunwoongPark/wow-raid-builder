import { queryOptions } from "@tanstack/react-query"

import { type GameRegion } from "@/shared/config/region"
import { characterKeys } from "@/shared/lib/query-keys"

import { characterApi } from "./api"

export const characterQueries = {
  raiderIO: (realm: string, name: string, region: GameRegion) =>
    queryOptions({
      ...characterKeys.raiderIO(realm, name, region),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getRaiderIO(realm, name, region),
      staleTime: 5 * 60 * 1000,
    }),

  search: (name: string, region: GameRegion) =>
    queryOptions({
      ...characterKeys.search(name, region),
      enabled: name.length >= 2,
      gcTime: 5 * 60 * 1000,
      queryFn: () => characterApi.search(name, region),
      retry: false,
      staleTime: 2 * 60 * 1000,
    }),

  summary: (realm: string, name: string, region: GameRegion) =>
    queryOptions({
      ...characterKeys.summary(realm, name, region),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getSummary(realm, name, region),
      staleTime: 5 * 60 * 1000,
    }),

  warcraftLogs: (realm: string, name: string, region: GameRegion) =>
    queryOptions({
      ...characterKeys.warcraftLogs(realm, name, region),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getWarcraftLogs(realm, name, region),
      staleTime: 10 * 60 * 1000,
    }),
}
