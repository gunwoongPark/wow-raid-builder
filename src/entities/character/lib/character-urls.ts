import { type RaiderIORaidProgression, type RosterCharacter } from "../types"
import { extractRealmSlug } from "./roster-url"

const WCL_DIFFICULTIES = {
  HEROIC: 4,
  KEYSTONE: 10,
  KEYSTONE_ZONE: 47,
  MYTHIC: 5,
} as const

export const getFirstRaidProgression = (
  raidProgression: Record<string, RaiderIORaidProgression> | undefined
): RaiderIORaidProgression | null => {
  if (!raidProgression) return null
  const first = Object.values(raidProgression)[0]
  return first ?? null
}

export interface CharacterUrls {
  armory: string
  wclBase: string
  wclHeroic: string
  wclKeystone: string
  wclMythic: string
}

export const buildCharacterUrls = (character: RosterCharacter): CharacterUrls => {
  const realmSlug = extractRealmSlug(character.id, character.name)
  const encodedName = encodeURIComponent(character.name)
  const encodedNameLower = encodeURIComponent(character.name.toLowerCase())

  const armory = `https://worldofwarcraft.blizzard.com/ko-kr/character/kr/${realmSlug}/${encodedName}`
  const wclBase = `https://www.warcraftlogs.com/character/kr/${realmSlug}/${encodedNameLower}`

  return {
    armory,
    wclBase,
    wclHeroic: `${wclBase}#difficulty=${WCL_DIFFICULTIES.HEROIC}`,
    wclKeystone: `${wclBase}#zone=${WCL_DIFFICULTIES.KEYSTONE_ZONE}&difficulty=${WCL_DIFFICULTIES.KEYSTONE}`,
    wclMythic: `${wclBase}#difficulty=${WCL_DIFFICULTIES.MYTHIC}`,
  }
}
