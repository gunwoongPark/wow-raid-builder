export type Role = "TANK" | "HEALER" | "MELEE" | "RANGED"

export interface CharacterSpec {
  name: string
  id: number
  role: { type: Role; name: string }
}

export interface CharacterSummary {
  name: string
  realm: string
  className: string
  classId: number
  spec: CharacterSpec
  itemLevel: number
}

export interface RaiderIORaidBoss {
  id: number
  name: string
  killed: boolean
  heroic_killed: boolean
  mythic_killed: boolean
}

export interface RaiderIORaidProgression {
  summary: string
  total_bosses: number
  normal_bosses_killed: number
  heroic_bosses_killed: number
  mythic_bosses_killed: number
}

export interface RaiderIOProfile {
  name: string
  race: string
  class: string
  active_spec_name: string
  active_spec_role: string
  gender: string
  faction: string
  achievement_points: number
  thumbnail_url: string
  realm: string
  region: string
  profile_url: string
  mythic_plus_scores_by_season: Array<{
    season: string
    scores: {
      all: number
      dps: number
      healer: number
      tank: number
    }
  }>
  raid_progression: Record<string, RaiderIORaidProgression>
}

export interface RosterCharacter {
  id: string // `${realm}-${name}` 형태의 고유키
  name: string
  realm: string
  className: string
  classId: number
  specName: string
  specId: number
  role: Role
  itemLevel: number
  raiderIO: {
    score: number
    raidProgression: Record<string, RaiderIORaidProgression>
    thumbnailUrl: string
    profileUrl: string
  } | null
}
