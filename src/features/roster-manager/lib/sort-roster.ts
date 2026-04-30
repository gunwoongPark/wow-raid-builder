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

type ComparableValue = string | number | null

const getRaidProgressScore = (character: RosterCharacter): number | null => {
  const progression = character.raiderIO?.raidProgression
    ? Object.values(character.raiderIO.raidProgression)[0]
    : null
  if (!progression) return null
  // 신화 진행도 우선, 동점이면 영웅으로 구분
  return progression.mythic_bosses_killed * 1000 + progression.heroic_bosses_killed
}

const getValue = (character: RosterCharacter, column: SortColumn): ComparableValue => {
  switch (column) {
    case "realm":
      return character.realm
    case "className":
      return character.className
    case "specName":
      return character.specName
    case "faction":
      return character.faction
    case "role":
      return ROLE_SORT_ORDER.indexOf(character.role)
    case "itemLevel":
      return character.itemLevel
    case "score":
      return character.raiderIO?.score ?? null
    case "logHeroic":
      return character.warcraftLogs?.heroic?.bestPerformanceAverage ?? null
    case "logMythic":
      return character.warcraftLogs?.mythic?.bestPerformanceAverage ?? null
    case "raidProgress":
      return getRaidProgressScore(character)
  }
}

export const sortRoster = (
  characters: RosterCharacter[],
  column: SortColumn,
  direction: SortDirection
): RosterCharacter[] =>
  [...characters].sort((a, b) => {
    const aValue = getValue(a, column)
    const bValue = getValue(b, column)

    // null은 방향 무관하게 항상 마지막
    if (aValue === null && bValue === null) return 0
    if (aValue === null) return 1
    if (bValue === null) return -1

    let comparison: number
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue, "ko")
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue
    } else {
      comparison = 0
    }

    return direction === "asc" ? comparison : -comparison
  })
