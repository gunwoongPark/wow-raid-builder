"use client"

import Image from "next/image"

import {
  analyzeBuffCoverage,
  BUFF_CATEGORIES,
  type BuffCategory,
  COUNTABLE_CATEGORIES,
  wowheadIconUrl,
} from "@/entities/character"
import { getClassColor } from "@/shared/config/class-colors"
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

interface BuffCardProps {
  buff: ReturnType<typeof analyzeBuffCoverage>[number]
  isCountable: boolean
}

const BuffCard = ({ buff, isCountable }: BuffCardProps) => (
  <div
    className={`flex min-h-18 items-center gap-2.5 rounded p-2 text-sm ${
      buff.covered
        ? "border border-emerald-500/40 bg-emerald-500/10 dark:border-emerald-500/30"
        : "border border-red-400/30 bg-red-500/5 dark:border-red-500/20"
    }`}
  >
    <div className="relative shrink-0">
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
          className={`line-clamp-2 min-w-0 flex-1 text-xs leading-snug font-medium ${
            buff.covered ? "text-foreground" : "text-foreground/50"
          }`}
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
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold"
              key={provider.label}
              style={{
                backgroundColor: `${getClassColor(provider.className)}22`,
                color: getClassColor(provider.className),
              }}
            >
              {provider.label}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
)

export const BuffAnalysis = () => {
  const characters = useRosterStore((store) => store.characters)
  const coverage = analyzeBuffCoverage(characters)

  if (characters.length === 0) return null

  // 이하 렌더는 characters가 있을 때만 도달

  const byCategory = BUFF_CATEGORIES.map((category) => ({
    buffs: coverage.filter((buff) => buff.category === category),
    category,
    isCountable: (COUNTABLE_CATEGORIES as string[]).includes(category),
  }))

  const inlineGroup = byCategory.filter(({ category }) => INLINE_CATEGORIES.has(category))
  const regularGroups = byCategory.filter(({ category }) => !INLINE_CATEGORIES.has(category))

  const totalCovered = coverage.filter((buff) => buff.covered).length
  const total = coverage.length

  return (
    <section className="border-border/40 bg-card/40 rounded-lg border p-5">
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

        {/* 블러드 + 전투부활 — 같은 행에 나란히 */}
        <div>
          <div className="mb-2 flex items-center gap-4">
            {inlineGroup.map(({ buffs, category }) => (
              <div className="flex items-center gap-1.5" key={category}>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {CATEGORY_LABEL[category]}
                </p>
                <span className="text-muted-foreground/60 text-xs">
                  {buffs.filter((b) => b.covered).length}/{buffs.length}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {inlineGroup.flatMap(({ buffs, isCountable }) =>
              buffs.map((buff) => <BuffCard buff={buff} isCountable={isCountable} key={buff.key} />)
            )}
          </div>
        </div>

        {/* 나머지 카테고리 */}
        {regularGroups.map(({ buffs, category, isCountable }) => {
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
                  <BuffCard buff={buff} isCountable={isCountable} key={buff.key} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
