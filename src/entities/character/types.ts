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
  season: string // 예: "season-mn-1" (CURRENT_SEASON in shared/config/season.ts)
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

// ─── 로스터 ───────────────────────────────────────────────────────────────────

export interface RosterCharacterRaiderIO {
  profileUrl: string
  raidProgression: Record<string, RaiderIORaidProgression>
  score: number
  thumbnailUrl: string
}

// ─── Warcraft Logs API v2 ─────────────────────────────────────────────────────
// 공식 스키마: https://www.warcraftlogs.com/v2-api-docs/warcraft/character.doc.html
// zoneRankings 필드는 JSON scalar — 아래 구조로 반환됨

export interface WCLBossRanking {
  bestAmount: number // 실제 DPS / HPS 수치
  encounter: { id: number; name: string }
  medianPercent: number | null // 해당 보스 중앙값 파싱 %
  rankPercent: number | null // 해당 보스 최고 파싱 %
  spec: string // 최고 파싱 달성 시 사용 스펙
}

export interface WCLZoneRankings {
  bestPerformanceAverage: number | null // 전체 보스 최고 파싱 평균
  medianPerformanceAverage: number | null // 전체 보스 중앙값 파싱 평균
  rankings: WCLBossRanking[] // 보스별 상세
}

export interface RosterCharacterWCL {
  heroic: WCLZoneRankings | null
  mythic: WCLZoneRankings | null
}

// ─── 캐릭터 검색 결과 ─────────────────────────────────────────────────────────

export interface CharacterSearchResult {
  className: string
  name: string
  raidSummary: string | null
  realm: string
  realmSlug: string
  score: number
  specName: string
  thumbnailUrl: string
}

export interface RosterCharacter {
  classId: number
  className: string
  faction: "alliance" | "horde"
  id: string // `${realmSlug}-${name}` 고유키
  itemLevel: number
  name: string
  raiderIO: RosterCharacterRaiderIO | null
  realm: string
  role: Role
  specId: number
  specName: string
  warcraftLogs: RosterCharacterWCL | null
}
