import { type BlizzardGuildMember, type BlizzardGuildRoster } from "@/shared/types/blizzard"

// Blizzard API 응답을 그대로 사용
export type { BlizzardGuildMember as GuildMember, BlizzardGuildRoster as GuildRoster }

// 앱 내부에서 사용하는 간소화된 길드 멤버 타입
export interface GuildMemberSummary {
  classId: number
  className: string
  id: number
  level: number
  name: string
  raceName: string
  rank: number
  realm: string
}
