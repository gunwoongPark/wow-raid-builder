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
          아래 직업/특성을 추가하면 가장 많은 버프를 채울 수 있습니다.
        </p>

        <ul className="flex flex-col gap-2">
          {recommendations.map((rec) => {
            const color = getClassColor(rec.className)
            return (
              <li
                className="border-border/40 flex items-start gap-3 rounded-md border px-3 py-2.5"
                key={rec.label}
              >
                <div
                  className="mt-0.5 h-3 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold" style={{ color }}>
                      {rec.label}
                    </span>
                    <span className="bg-primary/10 text-primary/70 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
                      +{rec.buffCount}개
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {rec.buffLabels.join(" · ")}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
