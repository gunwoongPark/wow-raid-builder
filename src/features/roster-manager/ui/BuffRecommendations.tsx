"use client"

import { analyzeBuffCoverage, getBuffRecommendations, useRosterStore } from "@/entities/character"
import { getClassColor } from "@/shared/config/class-colors"

export const BuffRecommendations = () => {
  const characters = useRosterStore((store) => store.characters)

  if (!characters.length) return null

  const coverage = analyzeBuffCoverage(characters)
  const recommendations = getBuffRecommendations(coverage)

  if (!recommendations.length) return null

  const uncoveredCount = coverage.filter((buff) => !buff.covered).length

  return (
    <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="fantasy text-primary text-base font-bold tracking-wide">버프 추천</span>
          <span className="text-muted-foreground/60 text-xs">
            미커버 {uncoveredCount}개 버프 기준
          </span>
        </div>

        <p className="text-muted-foreground text-sm">
          아래 직업/특성을 추가하면 가장 많은 시너지 버프를 채울 수 있습니다.
        </p>

        <ul className="flex flex-col gap-2">
          {recommendations.map((rec) => {
            const color = getClassColor(rec.className)
            const otherLabels = rec.buffLabels.filter((label) => !rec.synergyLabels.includes(label))

            return (
              <li
                className="border-border/40 flex items-start gap-3 rounded-md border px-3 py-2.5"
                key={rec.label}
              >
                <div
                  className="mt-1 h-3 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold" style={{ color }}>
                      {rec.label}
                    </span>
                    {rec.synergyCount > 0 && (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        시너지 +{rec.synergyCount}
                      </span>
                    )}
                    {otherLabels.length > 0 && (
                      <span className="bg-primary/10 text-primary/60 rounded px-1.5 py-0.5 text-[10px] font-semibold">
                        기타 +{otherLabels.length}
                      </span>
                    )}
                  </div>

                  {rec.synergyLabels.length > 0 && (
                    <p className="mt-0.5 truncate text-xs text-amber-600/80 dark:text-amber-400/70">
                      {rec.synergyLabels.join(" · ")}
                    </p>
                  )}
                  {otherLabels.length > 0 && (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {otherLabels.join(" · ")}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
