import { type BuffCoverage, type CandidateProvider, candidateProviderKey } from "../buffs"

export interface BuffRecommendation {
  buffCount: number
  buffKeys: string[]
  className: string
  providerKey: string
  specName: string | null
  synergyCount: number
  synergyKeys: string[]
}

/**
 * Returns the top classes/specs that would cover the most uncovered buffs.
 * Sorted by: synergy count first → total buff count.
 */
export const getBuffRecommendations = (
  coverage: BuffCoverage[],
  topCount = 5
): BuffRecommendation[] => {
  const uncovered = coverage.filter((buff) => !buff.covered)
  if (!uncovered.length) return []

  const map = new Map<
    string,
    {
      buffKeys: string[]
      provider: CandidateProvider
      synergyKeys: string[]
    }
  >()

  for (const buff of uncovered) {
    for (const provider of buff.candidateProviders) {
      const key = candidateProviderKey(provider)
      const entry = map.get(key)
      if (entry) {
        entry.buffKeys.push(buff.key)
        if (buff.category === "synergy") entry.synergyKeys.push(buff.key)
      } else {
        map.set(key, {
          buffKeys: [buff.key],
          provider,
          synergyKeys: buff.category === "synergy" ? [buff.key] : [],
        })
      }
    }
  }

  return Array.from(map.entries())
    .map(([providerKey, { buffKeys, provider, synergyKeys }]) => ({
      buffCount: buffKeys.length,
      buffKeys,
      className: provider.className,
      providerKey,
      specName: provider.specName,
      synergyCount: synergyKeys.length,
      synergyKeys,
    }))
    .sort((a, b) => {
      if (b.synergyCount !== a.synergyCount) return b.synergyCount - a.synergyCount
      return b.buffCount - a.buffCount
    })
    .slice(0, topCount)
}
