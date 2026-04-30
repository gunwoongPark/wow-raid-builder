"use client"

import { cva } from "class-variance-authority"
import { useTheme } from "next-themes"

import {
  analyzeBuffCoverage,
  BUFF_CATEGORIES,
  COUNTABLE_CATEGORIES,
  useRosterStore,
} from "@/entities/character"

import { CATEGORY_LABEL, INLINE_CATEGORIES } from "../config/buff-display"

const coverageBadgeVariants = cva("rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums", {
  variants: {
    level: {
      good: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      poor: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
  },
})
import { BuffCard } from "./BuffCard"

export const BuffAnalysis = () => {
  const characters = useRosterStore((store) => store.characters)
  const coverage = analyzeBuffCoverage(characters)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  if (characters.length === 0) return null

  const byCategory = BUFF_CATEGORIES.map((category) => ({
    buffs: coverage.filter((buff) => buff.category === category),
    category,
    isCountable: (COUNTABLE_CATEGORIES as string[]).includes(category),
  }))

  const inlineGroup = byCategory.filter(({ category }) => INLINE_CATEGORIES.has(category))
  const regularGroups = byCategory.filter(({ category }) => !INLINE_CATEGORIES.has(category))

  const totalCovered = coverage.filter((buff) => buff.covered).length
  const total = coverage.length
  const percent = Math.round((totalCovered / total) * 100)

  const coverageLevel = percent >= 80 ? "good" : percent >= 50 ? "medium" : "poor"

  return (
    <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
      <div className="flex flex-col gap-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4">
          <span className="fantasy text-primary text-base font-bold tracking-wide">
            버프 / 유틸 커버리지
          </span>
          <div className="flex items-center gap-2">
            <span className={coverageBadgeVariants({ level: coverageLevel })}>{percent}%</span>
            <span className="text-muted-foreground/60 text-xs">
              {totalCovered} / {total}
            </span>
          </div>
        </div>

        {/* WoW 스타일 프로그레스 바 */}
        <div className="relative h-2 w-full overflow-hidden rounded-sm border border-black/10 bg-black/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] dark:border-white/5 dark:bg-black/40 dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
          <div
            className="h-full rounded-sm bg-linear-to-r from-amber-600 to-yellow-400 transition-[width] duration-700 ease-out dark:from-amber-500 dark:to-yellow-300 dark:shadow-[0_0_10px_rgba(250,200,50,0.5)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* 블러드 + 전투부활 — 같은 행에 나란히 */}
        <div>
          <div className="mb-2 flex items-center gap-6">
            {inlineGroup.map(({ buffs, category }) => (
              <div className="flex items-center gap-1.5" key={category}>
                <p className="text-muted-foreground/80 text-[10px] font-bold tracking-widest uppercase">
                  {CATEGORY_LABEL[category]}
                </p>
                <span className="bg-primary/10 text-primary/70 rounded px-1 text-[9px] font-semibold tabular-nums">
                  {buffs.filter((buff) => buff.covered).length}/{buffs.length}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {inlineGroup.flatMap(({ buffs, isCountable }) =>
              buffs.map((buff) => (
                <BuffCard buff={buff} isCountable={isCountable} isDark={isDark} key={buff.key} />
              ))
            )}
          </div>
        </div>

        {/* 나머지 카테고리 */}
        {regularGroups.map(({ buffs, category, isCountable }) => {
          const coveredCount = buffs.filter((buff) => buff.covered).length
          return (
            <div key={category}>
              <p className="wow-section-title text-muted-foreground/80 mb-2">
                {CATEGORY_LABEL[category]}
                <span className="ml-1 text-[10px] font-normal tracking-normal normal-case opacity-55">
                  {coveredCount}/{buffs.length}
                </span>
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {buffs.map((buff) => (
                  <BuffCard buff={buff} isCountable={isCountable} isDark={isDark} key={buff.key} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
