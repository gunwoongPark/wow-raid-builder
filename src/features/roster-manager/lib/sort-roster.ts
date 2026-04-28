import { type RosterCharacter } from "@/entities/character"

import { ROLE_SORT_ORDER } from "../config/roster-display"

export const SORT_COLUMNS = [
  "realm",
  "className",
  "specName",
  "faction",
  "role",
  "itemLevel",
  "score",
  "logHeroic",
  "logMythic",
  "raidProgress",
] as const

export type SortColumn = (typeof SORT_COLUMNS)[number]

export type SortDirection = "asc" | "desc"

const getRaidProgressScore = (character: RosterCharacter): number | null => {
  const progression = character.raiderIO?.raidProgression
    ? Object.values(character.raiderIO.raidProgression)[0]
    : null
  if (!progression) return null
  // 신화 진행도 우선, 동점이면 영웅으로 구분
  return progression.mythic_bosses_killed * 1000 + progression.heroic_bosses_killed
}

const compareNullableLast = (a: number | null, b: number | null): number => {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a - b
}

const compareByColumn = (a: RosterCharacter, b: RosterCharacter, column: SortColumn): number => {
  switch (column) {
    case "realm":
      return a.realm.localeCompare(b.realm, "ko")
    case "className":
      return a.className.localeCompare(b.className, "ko")
    case "specName":
      return a.specName.localeCompare(b.specName, "ko")
    case "faction":
      return a.faction.localeCompare(b.faction)
    case "role":
      return ROLE_SORT_ORDER.indexOf(a.role) - ROLE_SORT_ORDER.indexOf(b.role)
    case "itemLevel":
      return a.itemLevel - b.itemLevel
    case "score":
      return compareNullableLast(a.raiderIO?.score ?? null, b.raiderIO?.score ?? null)
    case "logHeroic":
      return compareNullableLast(
        a.warcraftLogs?.heroic?.bestPerformanceAverage ?? null,
        b.warcraftLogs?.heroic?.bestPerformanceAverage ?? null
      )
    case "logMythic":
      return compareNullableLast(
        a.warcraftLogs?.mythic?.bestPerformanceAverage ?? null,
        b.warcraftLogs?.mythic?.bestPerformanceAverage ?? null
      )
    case "raidProgress":
      return compareNullableLast(getRaidProgressScore(a), getRaidProgressScore(b))
  }
}

export const sortRoster = (
  characters: RosterCharacter[],
  column: SortColumn,
  direction: SortDirection
): RosterCharacter[] =>
  [...characters].sort((a, b) => {
    const nullableColumns: SortColumn[] = ["score", "logHeroic", "logMythic", "raidProgress"]
    if (nullableColumns.includes(column)) {
      const scoreA = (() => {
        switch (column) {
          case "score":
            return a.raiderIO?.score ?? null
          case "logHeroic":
            return a.warcraftLogs?.heroic?.bestPerformanceAverage ?? null
          case "logMythic":
            return a.warcraftLogs?.mythic?.bestPerformanceAverage ?? null
          case "raidProgress":
            return getRaidProgressScore(a)
          default:
            return null
        }
      })()
      const scoreB = (() => {
        switch (column) {
          case "score":
            return b.raiderIO?.score ?? null
          case "logHeroic":
            return b.warcraftLogs?.heroic?.bestPerformanceAverage ?? null
          case "logMythic":
            return b.warcraftLogs?.mythic?.bestPerformanceAverage ?? null
          case "raidProgress":
            return getRaidProgressScore(b)
          default:
            return null
        }
      })()
      // null 은 방향과 무관하게 항상 마지막
      if (scoreA === null && scoreB === null) return 0
      if (scoreA === null) return 1
      if (scoreB === null) return -1
    }

    const result = compareByColumn(a, b, column)
    return direction === "asc" ? result : -result
  })
