import { type RosterCharacter } from "../types"

export interface RosterUrlEntry {
  name: string
  realmSlug: string
}

// id = `${realmSlug}-${name.toLowerCase()}`  (KR 캐릭터명에 하이픈 없음)
export const extractRealmSlug = (id: string, name: string): string =>
  id.slice(0, id.length - name.toLowerCase().length - 1)

// URL 포맷: ?r=azshara:%EC%95%A1%ED%9D%91,zuljin:%ED%9D%A5%EB%A7%88
// realm은 영문 slug 그대로, name만 encodeURIComponent
export const encodeRosterParam = (characters: RosterCharacter[]): string =>
  characters.map((c) => `${extractRealmSlug(c.id, c.name)}:${encodeURIComponent(c.name)}`).join(",")

export const decodeRosterParam = (param: string | null): RosterUrlEntry[] => {
  if (!param) return []
  return param.split(",").flatMap((entry) => {
    const index = entry.indexOf(":")
    if (index === -1) return []
    const realmSlug = entry.slice(0, index).trim()
    const name = decodeURIComponent(entry.slice(index + 1).trim())
    if (!realmSlug || !name) return []
    return [{ name, realmSlug }]
  })
}

export const buildShareUrl = (characters: RosterCharacter[]): string =>
  `${window.location.origin}?r=${encodeRosterParam(characters)}`
