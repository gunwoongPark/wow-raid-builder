import { createQueryKeys } from "@lukemorales/query-key-factory"

export const characterKeys = createQueryKeys("character", {
  raiderIO: (realm: string, name: string, region: string) => [{ name, realm, region }],
  search: (name: string, region: string) => [{ name, region }],
  summary: (realm: string, name: string, region: string) => [{ name, realm, region }],
  warcraftLogs: (realm: string, name: string, region: string) => [{ name, realm, region }],
})
