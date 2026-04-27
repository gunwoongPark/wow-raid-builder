export type Role = "HEALER" | "MELEE" | "RANGED" | "TANK"

// ─── Raider.IO ────────────────────────────────────────────────────────────────
// 공식 문서: https://raider.io/api#operation/getApiV1CharactersProfile

export interface RaiderIOAffix {
  description: string
  icon: string
  id: number
  name: string
  wowhead_url: string
}

export interface RaiderIOMythicRun {
  affixes: RaiderIOAffix[]
  completed_at: string
  dungeon: string
  duration: number
  keystone_run_id: number
  level: number
  score: number
  short_name: string
  url: string
}

export interface RaiderIORaidProgression {
  heroic_bosses_killed: number
  mythic_bosses_killed: number
  normal_bosses_killed: number
  summary: string // 예: "10/10 N, 10/10 H, 5/10 M"
  total_bosses: number
}

export interface RaiderIOMythicPlusScore {
  scores: {
    all: number // 전체 점수 (메인 지표)
    dps: number
    healer: number
    tank: number
  }
  season: string // 예: "season-tww-2"
}

// 공식 fields 파라미터 응답 구조
// https://raider.io/api#operation/getApiV1CharactersProfile
export interface RaiderIOProfile {
  achievement_points: number
  active_spec_name: string
  active_spec_role: string
  class: string
  faction: string
  gender: string
  mythic_plus_best_runs?: RaiderIOMythicRun[]
  mythic_plus_recent_runs?: RaiderIOMythicRun[]
  mythic_plus_scores_by_season?: RaiderIOMythicPlusScore[]
  name: string
  profile_url: string
  race: string
  raid_progression?: Record<string, RaiderIORaidProgression>
  realm: string
  region: string
  thumbnail_url: string
}

// ─── 에러 ─────────────────────────────────────────────────────────────────────

export interface RaiderIOErrorResponse {
  error: string
  message: string
  statusCode: number
}

// ─── 로스터 ───────────────────────────────────────────────────────────────────

export interface RosterCharacterRaiderIO {
  profileUrl: string
  raidProgression: Record<string, RaiderIORaidProgression>
  score: number
  thumbnailUrl: string
}

export interface RosterCharacter {
  classId: number
  className: string
  id: string // `${realmSlug}-${name}` 고유키
  itemLevel: number
  name: string
  raiderIO: RosterCharacterRaiderIO | null
  realm: string
  role: Role
  specId: number
  specName: string
}
