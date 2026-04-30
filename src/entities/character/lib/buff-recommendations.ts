import { type BuffCoverage } from "../buffs"

export interface BuffRecommendation {
  buffLabels: string[]
  buffCount: number
  className: string
  label: string
}

/**
 * 미커버 버프를 기준으로, 추가 시 가장 많은 버프를 채울 수 있는 직업/특성 목록을 반환한다.
 * 이미 로스터에 있는 직업/특성은 제외한다.
 */
export const getBuffRecommendations = (
  coverage: BuffCoverage[],
  topCount = 5
): BuffRecommendation[] => {
  const uncovered = coverage.filter((buff) => !buff.covered)
  if (!uncovered.length) return []

  const recommendationMap = new Map<
    string,
    { buffLabels: string[]; className: string; label: string }
  >()

  for (const buff of uncovered) {
    for (const provider of buff.candidateProviders) {
      const existing = recommendationMap.get(provider.label)
      if (existing) {
        existing.buffLabels.push(buff.label)
      } else {
        recommendationMap.set(provider.label, {
          buffLabels: [buff.label],
          className: provider.className,
          label: provider.label,
        })
      }
    }
  }

  return Array.from(recommendationMap.values())
    .map((rec) => ({ ...rec, buffCount: rec.buffLabels.length }))
    .sort((a, b) => b.buffCount - a.buffCount)
    .slice(0, topCount)
}
