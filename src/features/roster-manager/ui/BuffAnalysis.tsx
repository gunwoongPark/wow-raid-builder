"use client"

import Image from "next/image"

import {
  analyzeBuffCoverage,
  BUFF_CATEGORIES,
  type BuffCategory,
  COUNTABLE_CATEGORIES,
  wowheadIconUrl,
} from "@/entities/character"
import { useRosterStore } from "@/shared/model/roster-store"

const CATEGORY_LABEL: Record<BuffCategory, string> = {
  공대버프: "공대 버프",
  공대쿨기: "공대 쿨기",
  외생기: "외생기",
  유틸: "유틸",
  핵심: "핵심 버프",
}

export const BuffAnalysis = () => {
  const characters = useRosterStore((store) => store.characters)
  const coverage = analyzeBuffCoverage(characters)

  if (characters.length === 0) return null

  const byCategory = BUFF_CATEGORIES.map((category) => ({
    buffs: coverage.filter((buff) => buff.category === category),
    category,
    isCountable: (COUNTABLE_CATEGORIES as string[]).includes(category),
  }))

  const totalCovered = coverage.filter((buff) => buff.covered).length
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
        const coveredCount = buffs.filter((buff) => buff.covered).length
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
                  <div className="relative mt-0.5 shrink-0">
                    <Image
                      alt={buff.label}
                      className={`rounded ${buff.covered ? "" : "opacity-30 grayscale"}`}
                      height={24}
                      src={wowheadIconUrl(buff.icon)}
                      width={24}
                    />
                    <span
                      className={`absolute -right-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full text-[8px] leading-none font-bold ${
                        buff.covered ? "bg-emerald-500 text-white" : "bg-red-500/60 text-white"
                      }`}
                    >
                      {buff.covered ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <p
                        className={`text-xs leading-snug font-medium ${
                          buff.covered ? "text-foreground" : "text-foreground/50"
                        }`}
                      >
                        {buff.label}
                      </p>
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
