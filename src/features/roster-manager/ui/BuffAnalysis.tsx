"use client"

import {
  analyzeBuffCoverage,
  BUFF_CATEGORIES,
  type BuffCategory,
  COUNTABLE_CATEGORIES,
} from "@/entities/character"
import { useRosterStore } from "@/shared/model/roster-store"

const CATEGORY_LABEL: Record<BuffCategory, string> = {
  시너지: "공격대 시너지",
  오라: "기사 오라",
  유틸: "유틸",
  특수기: "공대 쿨기",
  핵심: "핵심 버프",
  힐러외생: "힐러 외생기",
}

export const BuffAnalysis = () => {
  const characters = useRosterStore((s) => s.characters)
  const coverage = analyzeBuffCoverage(characters)

  if (characters.length === 0) return null

  const byCategory = BUFF_CATEGORIES.map((cat) => ({
    buffs: coverage.filter((b) => b.category === cat),
    category: cat,
    isCountable: (COUNTABLE_CATEGORIES as string[]).includes(cat),
  }))

  const totalCovered = coverage.filter((b) => b.covered).length
  const total = coverage.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-primary font-semibold">버프 / 유틸 커버리지</span>
        <span className="text-muted-foreground text-xs">
          {totalCovered} / {total} 커버됨
        </span>
      </div>

      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.round((totalCovered / total) * 100)}%` }}
        />
      </div>

      {byCategory.map(({ buffs, category, isCountable }) => {
        const coveredCount = buffs.filter((b) => b.covered).length
        return (
          <div key={category}>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {CATEGORY_LABEL[category]}
              </p>
              <span className="text-muted-foreground/60 text-xs">
                {coveredCount}/{buffs.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {buffs.map((buff) => (
                <div
                  key={buff.key}
                  className={`flex items-start gap-2.5 rounded p-2 text-sm ${
                    buff.covered
                      ? "border border-emerald-500/30 bg-emerald-500/10"
                      : "border border-red-500/20 bg-red-500/5"
                  }`}
                >
                  <span
                    className={`mt-0.5 shrink-0 text-base leading-none ${
                      buff.covered ? "text-emerald-400" : "text-red-500/60"
                    }`}
                  >
                    {buff.covered ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <p
                        className={`text-xs leading-snug font-medium ${
                          buff.covered ? "text-foreground" : "text-foreground/50"
                        }`}
                      >
                        {buff.label}
                      </p>
                      {/* 시너지 제외, 커버된 경우 개수 표시 */}
                      {isCountable && buff.covered && buff.count > 0 && (
                        <span className="shrink-0 rounded bg-emerald-500/20 px-1 text-[10px] font-semibold text-emerald-400">
                          ×{buff.count}
                        </span>
                      )}
                    </div>
                    {buff.covered && (
                      <p className="mt-0.5 truncate text-[10px] text-emerald-400/70">
                        {buff.providers.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
