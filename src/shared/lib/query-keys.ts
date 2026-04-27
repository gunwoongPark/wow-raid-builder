import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"

export const guildKeys = createQueryKeys("guild", {
  members: (realm: string, guildName: string) => [{ guildName, realm }],
})

export const characterKeys = createQueryKeys("character", {
  raiderIO: (realm: string, name: string) => [{ name, realm }],
  search: (name: string) => [{ name }],
  summary: (realm: string, name: string) => [{ name, realm }],
  warcraftLogs: (realm: string, name: string) => [{ name, realm }],
})

// 앱 전체 쿼리 키 중앙 관리
export const queries = mergeQueryKeys(guildKeys, characterKeys)
