"use client"

import { cva } from "class-variance-authority"
import { useTranslations } from "next-intl"

import {
  analyzeBuffCoverage,
  BUFF_CATEGORIES,
  COUNTABLE_CATEGORIES,
  useRosterStore,
} from "@/entities/character"
import { useIsDarkMode } from "@/shared/lib/use-is-dark-mode"

import { INLINE_CATEGORIES } from "../config/buff-display"
import { BuffCard } from "./BuffCard"

const coverageBadgeVariants = cva("rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums", {
  variants: {
    level: {
      good: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      poor: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
  },
})

type CoverageLevel = "good" | "medium" | "poor"

const BAR_COLOR: Record<CoverageLevel, string> = {
  good: "bg-linear-to-r from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300",
  medium: "bg-linear-to-r from-amber-600 to-yellow-400 dark:from-amber-500 dark:to-yellow-300",
  poor: "bg-linear-to-r from-red-700 to-red-500",
}

export const BuffAnalysis = () => {
  const characters = useRosterStore((store) => store.characters)
  const coverage = analyzeBuffCoverage(characters)
  const isDark = useIsDarkMode()
  const t = useTranslations("buff")

  if (characters.length === 0) return null

  const byCategory = BUFF_CATEGORIES.map((category) => ({
    buffs: coverage.filter((buff) => buff.category === category),
    category,
    isCountable: COUNTABLE_CATEGORIES.includes(category),
  }))

  const inlineGroup = byCategory.filter(({ category }) => INLINE_CATEGORIES.has(category))
  const regularGroups = byCategory.filter(({ category }) => !INLINE_CATEGORIES.has(category))

  const totalCovered = coverage.filter((buff) => buff.covered).length
  const total = coverage.length
  const percent = Math.round((totalCovered / total) * 100)

  const coverageLevel: CoverageLevel = percent >= 80 ? "good" : percent >= 50 ? "medium" : "poor"

  return (
    <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-primary text-base font-bold tracking-wide">
            {t("sectionTitle")}
          </span>
          <div className="flex items-center gap-2">
            <span className={coverageBadgeVariants({ level: coverageLevel })}>{percent}%</span>
            <span className="text-muted-foreground/60 text-xs">
              {totalCovered} / {total}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 w-full overflow-hidden rounded-sm border border-black/10 bg-black/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] dark:border-white/5 dark:bg-black/40 dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
          <div
            className={`h-full rounded-sm transition-[width] duration-700 ease-out ${BAR_COLOR[coverageLevel]}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Bloodlust + Battle Rez — inline row */}
        {inlineGroup.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {inlineGroup.map(({ buffs, category, isCountable }) => (
              <div key={category}>
                <h3 className="text-muted-foreground/70 mb-2 text-[11px] font-semibold tracking-wider uppercase">
                  {t(`category.${category}`)}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {buffs.map((buff) => (
                    <BuffCard
                      buff={buff}
                      isCountable={isCountable}
                      isDark={isDark}
                      key={buff.key}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regular category groups */}
        {regularGroups.map(({ buffs, category, isCountable }) => (
          <div key={category}>
            <h3 className="text-muted-foreground/70 mb-2 text-[11px] font-semibold tracking-wider uppercase">
              {t(`category.${category}`)}
            </h3>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {buffs.map((buff) => (
                <BuffCard buff={buff} isCountable={isCountable} isDark={isDark} key={buff.key} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
