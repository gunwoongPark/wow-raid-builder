"use client"

import { type CandidateProvider } from "@/entities/character"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"

interface ProviderBadgeProps {
  isDark: boolean
  provider: CandidateProvider
}

export const ProviderBadge = ({ isDark, provider }: ProviderBadgeProps) => {
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
