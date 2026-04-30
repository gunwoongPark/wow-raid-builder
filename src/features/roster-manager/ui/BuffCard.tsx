"use client"

import { cva } from "class-variance-authority"
import Image from "next/image"

import { type analyzeBuffCoverage, wowheadIconUrl } from "@/entities/character"
import { cn } from "@/lib/utils"

import { ProviderBadge } from "./ProviderBadge"

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

interface BuffCardProps {
  buff: ReturnType<typeof analyzeBuffCoverage>[number]
  isDark: boolean
  isCountable: boolean
}

export const BuffCard = ({ buff, isCountable, isDark }: BuffCardProps) => (
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
