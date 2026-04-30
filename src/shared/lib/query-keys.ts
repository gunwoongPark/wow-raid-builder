import { createQueryKeys } from "@lukemorales/query-key-factory"

export const characterKeys = createQueryKeys("character", {
  raiderIO: (realm: string, name: string) => [{ name, realm }],
  search: (name: string) => [{ name }],
  summary: (realm: string, name: string) => [{ name, realm }],
  warcraftLogs: (realm: string, name: string) => [{ name, realm }],
})
