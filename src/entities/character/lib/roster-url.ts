import { type RosterCharacter } from "../types"

export interface RosterUrlEntry {
  name: string
  partyNumber?: number
  realmSlug: string
}

// id = `${realmSlug}-${name.toLowerCase()}`  (KR 캐릭터명에 하이픈 없음)
export const extractRealmSlug = (id: string, name: string): string =>
  id.slice(0, id.length - name.toLowerCase().length - 1)

// URL 포맷: ?r=azshara:%EC%95%A1%ED%9D%91~1,zuljin:%ED%9D%A5%EB%A7%88~2
// ~N suffix = 파티 번호 (없으면 미배정). realm slug · 캐릭터명에 ~ 없음 → 충돌 없음
const encodeRosterParam = (
  characters: RosterCharacter[],
  partyAssignments: Record<string, number> = {}
): string =>
  characters
    .map((c) => {
      const base = `${extractRealmSlug(c.id, c.name)}:${encodeURIComponent(c.name)}`
      const party = partyAssignments[c.id]
      return party !== undefined ? `${base}~${party}` : base
    })
    .join(",")

export const decodeRosterParam = (param: string | null): RosterUrlEntry[] => {
  if (!param) return []
  return param.split(",").flatMap((rawEntry) => {
    // ~N party suffix 추출 — 마지막 ~ 기준
    const tildeIndex = rawEntry.lastIndexOf("~")
    let partyNumber: number | undefined
    let entry = rawEntry
    if (tildeIndex !== -1) {
      const suffix = rawEntry.slice(tildeIndex + 1)
      const parsed = parseInt(suffix, 10)
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 6) {
        partyNumber = parsed
        entry = rawEntry.slice(0, tildeIndex)
      }
    }

    const colonIndex = entry.indexOf(":")
    if (colonIndex === -1) return []
    const realmSlug = entry.slice(0, colonIndex).trim()
    const name = decodeURIComponent(entry.slice(colonIndex + 1).trim())
    if (!realmSlug || !name) return []
    return [{ name, partyNumber, realmSlug }]
  })
}

export const buildShareUrl = (
  characters: RosterCharacter[],
  partyAssignments: Record<string, number> = {}
): string => `${window.location.origin}?r=${encodeRosterParam(characters, partyAssignments)}`
