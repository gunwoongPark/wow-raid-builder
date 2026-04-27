"use client"

import { analyzeBuffCoverage, BUFF_CATEGORIES, type BuffCategory } from "@/entities/character"
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
  }))

  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-semibold">버프 / 유틸 커버리지</span>
      {byCategory.map(({ buffs, category }) => (
        <div key={category}>
          <p className="mb-1 text-xs font-semibold text-gray-400 uppercase">
            {CATEGORY_LABEL[category]}
          </p>
          <div className="grid grid-cols-1 gap-1">
            {buffs.map((buff) => (
              <div
                key={buff.key}
                className={`flex items-start gap-2 rounded p-2 text-sm ${
                  buff.covered
                    ? "border border-green-200 bg-green-50"
                    : "border border-red-200 bg-red-50"
                }`}
              >
                <span className={buff.covered ? "text-green-600" : "text-red-400"}>
                  {buff.covered ? "✓" : "✗"}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium">{buff.label}</span>
                  {buff.covered && (
                    <p className="truncate text-xs text-gray-500">{buff.providers.join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
