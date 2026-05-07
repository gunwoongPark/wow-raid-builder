import { type RosterCharacter } from "@/entities/character"

import { MAX_PARTY_SIZE as PARTY_SIZE } from "../config/party"
const ROLE_ORDER = ["TANK", "HEALER", "MELEE", "RANGED"] as const

// 역할 균형 라운드 로빈: TANK → HEALER → MELEE → RANGED 순으로
// 각 역할 그룹을 파티들에 고르게 분배한다. 파티당 최대 PARTY_SIZE명.
export const autoAssignParties = (characters: RosterCharacter[]): Record<string, number> => {
  if (!characters.length) return {}

  const partyCount = Math.max(1, Math.ceil(characters.length / PARTY_SIZE))
  const partySizes = Array.from<number>({ length: partyCount }).fill(0)
  const assignments: Record<string, number> = {}

  for (const role of ROLE_ORDER) {
    const group = characters.filter((c) => c.role === role)
    let partyIndex = 0

    for (const character of group) {
      // 빈 자리가 있는 파티를 라운드 로빈으로 탐색
      let attempts = 0
      while ((partySizes[partyIndex] ?? 0) >= PARTY_SIZE && attempts < partyCount) {
        partyIndex = (partyIndex + 1) % partyCount
        attempts++
      }
      if ((partySizes[partyIndex] ?? 0) < PARTY_SIZE) {
        assignments[character.id] = partyIndex + 1
        partySizes[partyIndex] = (partySizes[partyIndex] ?? 0) + 1
        partyIndex = (partyIndex + 1) % partyCount
      }
    }
  }

  return assignments
}
