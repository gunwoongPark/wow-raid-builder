"use client"

import { useTranslations } from "next-intl"

import {
  Tooltip,
  TooltipContent,
  TooltipTitle,
  TooltipTrigger,
} from "@/components/ui/warcraftcn/tooltip"
import { type WCLZoneRankings } from "@/entities/character"
import { cn } from "@/lib/utils"

import { logColorClass, logVariant } from "../lib/log-color"

interface LogCellProps {
  wclUrl: string
  zone: WCLZoneRankings | null | undefined
}

export const LogCell = ({ wclUrl, zone }: LogCellProps) => {
  const t = useTranslations("roster.logTooltip")
  const average = zone?.bestPerformanceAverage
  if (average === null || average === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  const percent = Math.round(average)
  const rankings = zone?.rankings ?? []
  const variant = logVariant(percent)

  const trigger = (
    <a
      href={wclUrl}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        logColorClass(percent),
        "underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70"
      )}
    >
      {percent}
    </a>
  )

  if (!rankings.length) {
    return trigger
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent className="min-w-[220px]" side="left" variant={variant}>
        <TooltipTitle>{t("title", { percent })}</TooltipTitle>
        <div className="mt-2 flex flex-col gap-1">
          {rankings.map((ranking) => (
            <div className="flex items-center justify-between gap-3" key={ranking.encounter.id}>
              <span className="flex-1 text-[11px] text-stone-600 dark:text-amber-100/70">
                {ranking.encounter.name}
              </span>
              <span
                className={cn(
                  "shrink-0 font-mono text-[11px]",
                  logColorClass(Math.round(ranking.rankPercent ?? 0))
                )}
              >
                {ranking.rankPercent !== null && ranking.rankPercent !== undefined
                  ? Math.round(ranking.rankPercent)
                  : "—"}
              </span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
