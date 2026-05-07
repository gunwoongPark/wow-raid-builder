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
      gcTime: 5 * 60 * 1000,
      queryFn: () => characterApi.search(name),
      // 검색은 404가 정상 응답(캐릭터 없음)이므로 재시도 불필요
      retry: false,
      staleTime: 2 * 60 * 1000,
    }),

  summary: (realm: string, name: string) =>
    queryOptions({
      ...characterKeys.summary(realm, name),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getSummary(realm, name),
      staleTime: 5 * 60 * 1000,
    }),

  warcraftLogs: (realm: string, name: string) =>
    queryOptions({
      ...characterKeys.warcraftLogs(realm, name),
      enabled: Boolean(realm && name),
      queryFn: () => characterApi.getWarcraftLogs(realm, name),
      staleTime: 10 * 60 * 1000,
    }),
}
