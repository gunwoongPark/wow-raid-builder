// ─── 현재 시즌 상수 ───────────────────────────────────────────────────────────
// 시즌 변경 시 이 파일만 수정하면 됩니다.

// Raider.IO 시즌 슬러그
// 확인: https://raider.io/api/v1/mythic-plus/seasons?region=kr
export const CURRENT_SEASON = "season-mn-1" // Midnight Season 1

// Warcraft Logs 레이드 Zone ID (쐐기 존 아님, 레이드 전용)
// 확인: WCL GraphQL → worldData { expansions { zones { id name } } }
// Zone 46 = VS / DR / MQD (Midnight S1 raid, 9 bosses)
// Zone 47 = Mythic+ Season 1 (쐐기 — 레이드 아님)
export const CURRENT_WCL_ZONE_ID = 46

// 레이드 표시명
export const CURRENT_RAID_NAME = "VS / DR / MQD"
