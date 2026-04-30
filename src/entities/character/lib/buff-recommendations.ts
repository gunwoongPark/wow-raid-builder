import { type BuffCoverage } from "../buffs"

export interface BuffRecommendation {
  buffCount: number
  buffLabels: string[]
  className: string
  label: string
  synergyCount: number
  synergyLabels: string[]
}

/**
 * 미커버 버프를 기준으로 추가 시 가장 유용한 직업/특성 목록을 반환한다.
 * 정렬: 시너지 커버 수 우선 → 전체 버프 수
 */
export const getBuffRecommendations = (
  coverage: BuffCoverage[],
  topCount = 5
): BuffRecommendation[] => {
  const uncovered = coverage.filter((buff) => !buff.covered)
  if (!uncovered.length) return []

  const map = new Map<
    string,
    { buffLabels: string[]; className: string; label: string; synergyLabels: string[] }
  >()

  for (const buff of uncovered) {
    for (const provider of buff.candidateProviders) {
      const entry = map.get(provider.label)
      if (entry) {
        entry.buffLabels.push(buff.label)
        if (buff.category === "시너지") entry.synergyLabels.push(buff.label)
      } else {
        map.set(provider.label, {
          buffLabels: [buff.label],
          className: provider.className,
          label: provider.label,
          synergyLabels: buff.category === "시너지" ? [buff.label] : [],
        })
      }
    }
  }

  return Array.from(map.values())
    .map((rec) => ({
      ...rec,
      buffCount: rec.buffLabels.length,
      synergyCount: rec.synergyLabels.length,
    }))
    .sort((a, b) => {
      if (b.synergyCount !== a.synergyCount) return b.synergyCount - a.synergyCount
      return b.buffCount - a.buffCount
    })
    .slice(0, topCount)
}
