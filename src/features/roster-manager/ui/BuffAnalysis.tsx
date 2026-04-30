"use client"

import { cva } from "class-variance-authority"
import { useTheme } from "next-themes"
import Image from "next/image"

import {
  analyzeBuffCoverage,
  BUFF_CATEGORIES,
  type BuffCategory,
  type CandidateProvider,
  COUNTABLE_CATEGORIES,
  wowheadIconUrl,
} from "@/entities/character"
import { cn } from "@/lib/utils"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"
import { useRosterStore } from "@/shared/model/roster-store"

const CATEGORY_LABEL: Record<BuffCategory, string> = {
  공생기: "공생기",
  블러드: "블러드",
  시너지: "시너지",
  외생기: "외생기",
  유틸: "유틸",
  전투부활: "전투 부활",
}

// 블러드와 전투부활은 한 행에 나란히 표시
const INLINE_CATEGORIES = new Set<BuffCategory>(["블러드", "전투부활"])

// ─── cva 변형 정의 ──────────────────────────────���─────────────────────────────

const buffCardVariants = cva(
  "flex min-h-14 items-center gap-2.5 rounded border border-l-2 p-2 pl-2.5 text-sm",
  {
    variants: {
      state: {
        covered:
          "border-emerald-500/40 border-l-emerald-500 bg-emerald-500/8 dark:border-emerald-400/30 dark:border-l-emerald-400 dark:bg-emerald-950/35",
        missing:
          "border-red-400/30 border-l-red-500/60 bg-red-500/5 dark:border-red-500/20 dark:border-l-red-500/50 dark:bg-red-950/25",
      },
    },
  }
)

const coverageBadgeVariants = cva("rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums", {
  variants: {
    level: {
      good: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      poor: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
  },
})

// ─── ProviderBadge ───────────────────────���──────────────────────────��─────────

interface ProviderBadgeProps {
  isDark: boolean
  provider: CandidateProvider
}

const ProviderBadge = ({ isDark, provider }: ProviderBadgeProps) => {
  const color = isDark ? getClassColor(provider.className) : getClassColorLight(provider.className)

  return (
    <span
      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {provider.label}
    </span>
  )
}

// ─── BuffCard ─────────────────────────���───────────────────────────────────��───

interface BuffCardProps {
  buff: ReturnType<typeof analyzeBuffCoverage>[number]
  isDark: boolean
  isCountable: boolean
}

const BuffCard = ({ buff, isCountable, isDark }: BuffCardProps) => (
  <div className={buffCardVariants({ state: buff.covered ? "covered" : "missing" })}>
    <div className="relative shrink-0">
      <Image
        alt={buff.label}
        className={cn("rounded", !buff.covered && "opacity-30 grayscale")}
        height={24}
        src={wowheadIconUrl(buff.icon)}
        width={24}
      />
      <span
        className={cn(
          "absolute -right-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full text-[8px] leading-none font-bold text-white",
          buff.covered ? "bg-emerald-500" : "bg-red-500/60"
        )}
      >
        {buff.covered ? "✓" : "✗"}
      </span>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline gap-1.5">
        <p
          className={cn(
            "line-clamp-2 min-w-0 flex-1 text-xs leading-snug font-medium",
            buff.covered ? "text-foreground" : "text-foreground/50"
          )}
        >
          {buff.label}
        </p>
        {isCountable && buff.covered && buff.count > 0 && (
          <span className="shrink-0 rounded bg-emerald-500/20 px-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            ×{buff.count}
          </span>
        )}
      </div>
      {buff.covered && (
        <p className="mt-0.5 truncate text-[10px] text-emerald-600 dark:text-emerald-400/70">
          {buff.providers.join(", ")}
        </p>
      )}
      {!buff.covered && buff.candidateProviders.length > 0 && (
        <div className="mt-1.5 flex gap-1 overflow-hidden">
          {buff.candidateProviders.map((provider) => (
            <ProviderBadge isDark={isDark} key={provider.label} provider={provider} />
          ))}
        </div>
      )}
    </div>
  </div>
)

// ─── BuffAnalysis (메인) ──────────────────────────��───────────────────────────

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
