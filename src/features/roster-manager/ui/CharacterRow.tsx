"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"
import {
  buildCharacterUrls,
  getFirstRaidProgression,
  normalizeName,
  type RosterCharacter,
  useRosterStore,
} from "@/entities/character"
import { cn } from "@/lib/utils"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"

import { FACTION_CLASS, ROLE_COLOR } from "../config/roster-display"
import { LogCell } from "./LogCell"
import { ScoreCell } from "./ScoreCell"

interface CharacterRowProps {
  character: RosterCharacter
  isRefreshing: boolean
  onRefresh: (id: string) => void
}

export const CharacterRow = ({ character, isRefreshing, onRefresh }: CharacterRowProps) => {
  const removeCharacter = useRosterStore((store) => store.removeCharacter)
  const storePendingRaiderIO = useRosterStore((store) => store.pendingRaiderIOIds.has(character.id))
  const storePendingWCL = useRosterStore((store) => store.pendingWCLIds.has(character.id))
  const isPendingRaiderIO = isRefreshing || storePendingRaiderIO
  const isPendingWCL = isRefreshing || storePendingWCL
  const classColor = getClassColor(character.className)
  const classColorLight = getClassColorLight(character.className)
  const score = character.raiderIO?.score ?? 0
  const progression = getFirstRaidProgression(character.raiderIO?.raidProgression)
  const {
    armory: armoryUrl,
    wclHeroic: wclHeroicUrl,
    wclKeystone: wclKeystoneUrl,
    wclMythic: wclMythicUrl,
  } = buildCharacterUrls(character)
  const tRole = useTranslations("role")
  const tFaction = useTranslations("faction")
  const tAction = useTranslations("roster.action")
  const tClass = useTranslations("className")
  const tSpec = useTranslations("specById")

  const handleRemove = () => removeCharacter(character.id)
  const handleRefresh = () => onRefresh(character.id)

  return (
    <tr className="border-border/30 hover:bg-primary/5 dark:hover:bg-primary/[0.07] h-14 border-b transition-colors">
      {/* Thumbnail + name (armory) + Raider.IO link */}
      <td className="min-w-[160px] px-3 py-2">
        <div className="flex items-center gap-2">
          {isPendingRaiderIO ? (
            <Skeleton className="size-8 rounded" />
          ) : character.raiderIO?.thumbnailUrl ? (
            <Image
              alt={character.name}
              className="border-border/50 size-8 rounded border"
              height={32}
              src={character.raiderIO.thumbnailUrl}
              width={32}
            />
          ) : (
            <div className="border-border/50 bg-muted size-8 rounded border" />
          )}
          <div className="flex flex-col">
            <a
              className="font-semibold hover:underline"
              href={armoryUrl}
              rel="noopener noreferrer"
              style={{ color: `light-dark(${classColorLight}, ${classColor})` }}
              target="_blank"
            >
              {character.name}
            </a>
            {isPendingRaiderIO ? (
              <Skeleton className="mt-0.5 h-2.5 w-14 rounded" />
            ) : (
              character.raiderIO?.profileUrl && (
                <a
                  className="text-muted-foreground/50 hover:text-muted-foreground text-[10px] transition-colors"
                  href={character.raiderIO.profileUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Raider.IO ↗
                </a>
              )
            )}
          </div>
        </div>
      </td>

      <td className="text-muted-foreground min-w-[90px] px-3 py-2 text-sm">{character.realm}</td>
      <td className="text-foreground/80 min-w-[90px] px-3 py-2 text-sm">
        {tClass(normalizeName(character.className))}
      </td>
      <td
        className="min-w-[80px] px-3 py-2 text-sm"
        style={{ color: `light-dark(${classColorLight}, ${classColor})` }}
      >
        {tSpec(String(character.specId))}
      </td>
      <td className="min-w-[56px] px-3 py-2 text-sm">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-semibold",
            FACTION_CLASS[character.faction]
          )}
        >
          {tFaction(character.faction)}
        </span>
      </td>
      <td className={cn("min-w-[56px] px-3 py-2 text-sm font-medium", ROLE_COLOR[character.role])}>
        {tRole(character.role)}
      </td>
      <td className="text-foreground/90 min-w-[80px] px-3 py-2 text-sm">{character.itemLevel}</td>

      <td className="min-w-[72px] px-3 py-2 font-mono text-sm">
        {isPendingRaiderIO ? (
          <Skeleton className="h-4 w-12 rounded" />
        ) : (
          <ScoreCell profileUrl={wclKeystoneUrl} score={score} />
        )}
      </td>

      <td className="min-w-[60px] px-3 py-2 font-mono text-sm">
        {isPendingWCL ? (
          <Skeleton className="h-4 w-8 rounded" />
        ) : (
          <LogCell wclUrl={wclHeroicUrl} zone={character.warcraftLogs?.heroic} />
        )}
      </td>
      <td className="min-w-[60px] px-3 py-2 font-mono text-sm">
        {isPendingWCL ? (
          <Skeleton className="h-4 w-8 rounded" />
        ) : (
          <LogCell wclUrl={wclMythicUrl} zone={character.warcraftLogs?.mythic} />
        )}
      </td>

      <td className="min-w-[96px] px-3 py-2 text-xs">
        {isPendingRaiderIO ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        ) : progression ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-blue-700 dark:text-blue-400">
              H {progression.heroic_bosses_killed}/{progression.total_bosses}
            </span>
            <span className="text-amber-700 dark:text-yellow-500">
              M {progression.mythic_bosses_killed}/{progression.total_bosses}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>

      {/* Action: refresh + remove */}
      <td className="min-w-[64px] px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            aria-label={tAction("refresh")}
            className="dark:text-muted-foreground/40 rounded border border-transparent p-1.5 text-stone-400 transition-all hover:border-sky-500/25 hover:bg-sky-500/10 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:border-sky-400/25 dark:hover:text-sky-400"
            disabled={isRefreshing}
            onClick={handleRefresh}
            title={tAction("refresh")}
          >
            <span className={cn("block text-base leading-none", isRefreshing && "animate-spin")}>
              ↻
            </span>
          </button>
          <div className="bg-border/40 h-4 w-px" />
          <button
            aria-label={`${character.name} ${tAction("remove")}`}
            className="dark:text-muted-foreground/40 rounded border border-transparent p-1.5 text-xs text-stone-400 transition-all hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:border-red-400/25 dark:hover:text-red-400"
            disabled={isRefreshing}
            onClick={handleRemove}
            title={tAction("remove")}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  )
}
