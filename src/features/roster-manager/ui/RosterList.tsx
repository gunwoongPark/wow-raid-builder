"use client"

import Image from "next/image"
import { toast } from "sonner"

import {
  Tooltip,
  TooltipContent,
  TooltipTitle,
  TooltipTrigger,
} from "@/components/ui/warcraftcn/tooltip"
import { type RosterCharacter, type WCLZoneRankings } from "@/entities/character"
import { getClassColor } from "@/shared/config/class-colors"
import { extractRealmSlug } from "@/shared/lib/roster-url"
import { useRosterStore } from "@/shared/model/roster-store"

import { useRosterSync } from "../model/useRosterSync"

const ROLE_LABEL: Record<string, string> = {
  HEALER: "힐러",
  MELEE: "근딜",
  RANGED: "원딜",
  TANK: "탱커",
}

const ROLE_COLOR: Record<string, string> = {
  HEALER: "text-emerald-400",
  MELEE: "text-red-400",
  RANGED: "text-sky-400",
  TANK: "text-blue-400",
}

const ScoreColor = ({ score }: { score: number }) => {
  const color =
    score >= 3000
      ? "text-orange-400 font-bold"
      : score >= 2000
        ? "text-purple-400"
        : score >= 1000
          ? "text-blue-400"
          : "text-muted-foreground"
  return <span className={color}>{score > 0 ? score.toLocaleString() : "—"}</span>
}

type ParseVariant = "legendary" | "epic" | "rare" | "uncommon" | "default"

const parseColorClass = (pct: number) =>
  pct >= 95
    ? "text-yellow-400 font-bold"
    : pct >= 75
      ? "text-purple-400"
      : pct >= 50
        ? "text-blue-400"
        : pct >= 25
          ? "text-green-400"
          : "text-muted-foreground"

const parseVariant = (pct: number): ParseVariant =>
  pct >= 95
    ? "legendary"
    : pct >= 75
      ? "epic"
      : pct >= 50
        ? "rare"
        : pct >= 25
          ? "uncommon"
          : "default"

const ParseCell = ({ zone }: { zone: WCLZoneRankings | null | undefined }) => {
  const avg = zone?.bestPerformanceAverage
  if (avg === null || avg === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  const pct = Math.round(avg)
  const rankings = zone?.rankings ?? []
  const variant = parseVariant(pct)

  if (!rankings.length) {
    return <span className={parseColorClass(pct)}>{pct}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`${parseColorClass(pct)} cursor-pointer underline decoration-dotted underline-offset-2`}
        >
          {pct}
        </span>
      </TooltipTrigger>
      <TooltipContent side="left" variant={variant}>
        <TooltipTitle>보스별 로그 (평균 {pct})</TooltipTitle>
        <div className="mt-2 flex flex-col gap-1">
          {rankings.map((r) => (
            <div className="flex items-center justify-between gap-4" key={r.encounter.id}>
              <span className="max-w-[140px] truncate text-[11px] text-amber-100/70">
                {r.encounter.name}
              </span>
              <span
                className={`shrink-0 font-mono text-[11px] ${parseColorClass(Math.round(r.rankPercent ?? 0))}`}
              >
                {r.rankPercent !== null && r.rankPercent !== undefined
                  ? Math.round(r.rankPercent)
                  : "—"}
              </span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

interface CharacterRowProps {
  character: RosterCharacter
  isRefreshing: boolean
  onRefresh: () => void
}

const CharacterRow = ({ character, isRefreshing, onRefresh }: CharacterRowProps) => {
  const removeCharacter = useRosterStore((s) => s.removeCharacter)
  const classColor = getClassColor(character.className)
  const score = character.raiderIO?.score ?? 0
  const progression = character.raiderIO?.raidProgression
    ? Object.values(character.raiderIO.raidProgression)[0]
    : null

  const realmSlug = extractRealmSlug(character.id, character.name)
  const armoryUrl = `https://worldofwarcraft.blizzard.com/ko-kr/character/kr/${realmSlug}/${encodeURIComponent(character.name)}`

  return (
    <tr className="border-border/30 border-b transition-colors hover:bg-white/5">
      {/* 썸네일 + 이름(아머리) + Raider.IO 링크 */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {character.raiderIO?.thumbnailUrl ? (
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
              style={{ color: classColor }}
              target="_blank"
            >
              {character.name}
            </a>
            {character.raiderIO?.profileUrl && (
              <a
                className="text-muted-foreground/50 hover:text-muted-foreground text-[10px] transition-colors"
                href={character.raiderIO.profileUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Raider.IO ↗
              </a>
            )}
          </div>
        </div>
      </td>

      <td className="text-muted-foreground px-3 py-2 text-sm">{character.realm}</td>
      <td className="px-3 py-2 text-sm" style={{ color: classColor }}>
        {character.specName}
      </td>
      <td className="text-foreground/80 px-3 py-2 text-sm">{character.className}</td>
      <td className={`px-3 py-2 text-sm font-medium ${ROLE_COLOR[character.role] ?? ""}`}>
        {ROLE_LABEL[character.role] ?? character.role}
      </td>
      <td className="text-foreground/90 px-3 py-2 text-sm">{character.itemLevel}</td>

      <td className="px-3 py-2 font-mono text-sm">
        <ScoreColor score={score} />
      </td>

      <td className="px-3 py-2 font-mono text-sm">
        <ParseCell zone={character.warcraftLogs?.heroic} />
      </td>
      <td className="px-3 py-2 font-mono text-sm">
        <ParseCell zone={character.warcraftLogs?.mythic} />
      </td>

      <td className="px-3 py-2 text-xs">
        {progression ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-blue-400">
              H {progression.heroic_bosses_killed}/{progression.total_bosses}
            </span>
            <span className="text-yellow-500">
              M {progression.mythic_bosses_killed}/{progression.total_bosses}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>

      {/* 액션 버튼: 새로고침 + 제거 */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            aria-label="최신화"
            className="text-muted-foreground/50 rounded p-1.5 transition-colors hover:bg-sky-400/10 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-30"
            disabled={isRefreshing}
            onClick={onRefresh}
            title="최신화"
          >
            <span className={`block text-base leading-none ${isRefreshing ? "animate-spin" : ""}`}>
              ↻
            </span>
          </button>
          <div className="bg-border/40 h-4 w-px" />
          <button
            className="text-muted-foreground/50 rounded p-1.5 text-xs transition-colors hover:bg-red-400/10 hover:text-red-400"
            onClick={() => removeCharacter(character.id)}
            title="제거"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  )
}

export const RosterList = () => {
  const characters = useRosterStore((s) => s.characters)
  const clearRoster = useRosterStore((s) => s.clearRoster)
  const { copyShareUrl, isRefreshing, refreshAll, refreshingIds, refreshOne } = useRosterSync()

  const handleCopy = () => {
    copyShareUrl()
    toast.success("링크 복사됨!", {
      description: `공격대 ${characters.length}명 로스터 링크가 클립보드에 복사됐습니다.`,
    })
  }

  const handleRefreshAll = async () => {
    await refreshAll()
    toast.success("최신화 완료!", { description: "모든 공대원 데이터가 업데이트됐습니다." })
  }

  if (characters.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        아직 추가된 공대원이 없습니다.
      </p>
    )
  }

  const roleOrder = ["TANK", "HEALER", "MELEE", "RANGED"]
  const sorted = [...characters].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  )

  const roleCounts = sorted.reduce<Record<string, number>>((acc, c) => {
    acc[c.role] = (acc[c.role] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-primary font-semibold">공격대 ({characters.length}명)</span>
          <div className="flex gap-2 text-xs">
            {Object.entries(roleCounts).map(([role, count]) => (
              <span className={ROLE_COLOR[role] ?? ""} key={role}>
                {ROLE_LABEL[role]} {count}
              </span>
            ))}
          </div>
        </div>

        {/* 헤더 액션 버튼 */}
        <div className="flex items-center gap-2">
          {/* 전체 최신화 */}
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-sky-400/80 transition-colors hover:bg-sky-400/10 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isRefreshing}
            onClick={handleRefreshAll}
          >
            <span className={`text-sm ${isRefreshing ? "animate-spin" : ""}`}>↻</span>
            {isRefreshing ? "최신화 중…" : "전체 최신화"}
          </button>

          {/* 링크 복사 */}
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-emerald-400/80 transition-colors hover:bg-emerald-400/10 hover:text-emerald-400"
            onClick={handleCopy}
          >
            🔗 링크 복사
          </button>

          {/* 전체 초기화 */}
          <button
            className="text-muted-foreground/60 text-xs transition-colors hover:text-red-400"
            onClick={clearRoster}
          >
            전체 초기화
          </button>
        </div>
      </div>

      <div className="border-border/40 bg-card/60 overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-border/40 text-muted-foreground border-b text-xs">
              <th className="px-3 py-2">캐릭터</th>
              <th className="px-3 py-2">서버</th>
              <th className="px-3 py-2">특성</th>
              <th className="px-3 py-2">직업</th>
              <th className="px-3 py-2">역할</th>
              <th className="px-3 py-2">아이템레벨</th>
              <th className="px-3 py-2">M+ 점수</th>
              <th className="px-3 py-2 text-blue-400/70">로그 H</th>
              <th className="px-3 py-2 text-yellow-500/70">로그 M</th>
              <th className="px-3 py-2">레이드 진행</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <CharacterRow
                character={c}
                isRefreshing={refreshingIds.has(c.id)}
                key={c.id}
                onRefresh={() => refreshOne(c.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
