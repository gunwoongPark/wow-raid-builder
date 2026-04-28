"use client"

import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

import { Skeleton } from "@/components/ui/skeleton"
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

import { ROLE_COLOR, ROLE_LABEL, ROLE_SORT_ORDER } from "../config/roster-display"
import { logColorClass, logVariant } from "../lib/log-color"
import { SORT_COLUMNS, type SortColumn, type SortDirection, sortRoster } from "../lib/sort-roster"
import { useRosterSync } from "../model/useRosterSync"

// ─── M+ 점수 색상 표시 컴포넌트 ──────────────────────────────────────────────

interface ScoreCellProps {
  profileUrl?: string
  score: number
}

const ScoreCell = ({ profileUrl, score }: ScoreCellProps) => {
  const colorClass =
    score >= 3000
      ? "font-bold text-orange-500 dark:text-orange-400"
      : score >= 2000
        ? "text-purple-600 dark:text-purple-400"
        : score >= 1000
          ? "text-blue-700 dark:text-blue-400"
          : "text-muted-foreground"

  const text = score > 0 ? score.toLocaleString() : "—"

  if (!profileUrl || score === 0) {
    return <span className={colorClass}>{text}</span>
  }

  return (
    <a
      className={`${colorClass} underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70`}
      href={profileUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      {text}
    </a>
  )
}

// ─── WCL 로그 % 셀 (호버 시 보스별 상세, 클릭 시 WCL 페이지 이동) ──────────

interface LogCellProps {
  wclUrl: string
  zone: WCLZoneRankings | null | undefined
}

const LogCell = ({ wclUrl, zone }: LogCellProps) => {
  const average = zone?.bestPerformanceAverage
  if (average === null || average === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  const percent = Math.round(average)
  const rankings = zone?.rankings ?? []
  const variant = logVariant(percent)

  const trigger = (
    <a
      className={`${logColorClass(percent)} underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70`}
      href={wclUrl}
      rel="noopener noreferrer"
      target="_blank"
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
        <TooltipTitle>보스별 로그 (평균 {percent})</TooltipTitle>
        <div className="mt-2 flex flex-col gap-1">
          {rankings.map((ranking) => (
            <div className="flex items-center justify-between gap-3" key={ranking.encounter.id}>
              <span className="flex-1 text-[11px] text-stone-600 dark:text-amber-100/70">
                {ranking.encounter.name}
              </span>
              <span
                className={`shrink-0 font-mono text-[11px] ${logColorClass(Math.round(ranking.rankPercent ?? 0))}`}
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

// ─── 캐릭터 행 ───────────────────────────────────────────────────────────────

interface CharacterRowProps {
  character: RosterCharacter
  isRefreshing: boolean
  onRefresh: () => void
}

const CharacterRow = ({ character, isRefreshing, onRefresh }: CharacterRowProps) => {
  // 변수부
  const removeCharacter = useRosterStore((store) => store.removeCharacter)
  const isPendingRaiderIO = useRosterStore((store) => store.pendingRaiderIOIds.has(character.id))
  const isPendingWCL = useRosterStore((store) => store.pendingWCLIds.has(character.id))
  const classColor = getClassColor(character.className)
  const score = character.raiderIO?.score ?? 0
  const progression = character.raiderIO?.raidProgression
    ? Object.values(character.raiderIO.raidProgression)[0]
    : null
  const realmSlug = extractRealmSlug(character.id, character.name)
  const armoryUrl = `https://worldofwarcraft.blizzard.com/ko-kr/character/kr/${realmSlug}/${encodeURIComponent(character.name)}`
  const wclUrl = `https://www.warcraftlogs.com/character/kr/${realmSlug}/${encodeURIComponent(character.name.toLowerCase())}`

  // 렌더
  return (
    <tr className="border-border/30 h-[52px] border-b transition-colors hover:bg-black/3 dark:hover:bg-white/5">
      {/* 썸네일 + 이름(아머리) + Raider.IO 링크 */}
      <td className="px-3 py-2">
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
              style={{ color: classColor }}
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

      <td className="text-muted-foreground px-3 py-2 text-sm">{character.realm}</td>
      <td className="text-foreground/80 px-3 py-2 text-sm">{character.className}</td>
      <td className="px-3 py-2 text-sm" style={{ color: classColor }}>
        {character.specName}
      </td>
      <td className="px-3 py-2 text-sm">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            character.faction === "alliance"
              ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
              : "bg-red-500/15 text-red-700 dark:text-red-400"
          }`}
        >
          {character.faction === "alliance" ? "얼라" : "호드"}
        </span>
      </td>
      <td className={`px-3 py-2 text-sm font-medium ${ROLE_COLOR[character.role] ?? ""}`}>
        {ROLE_LABEL[character.role] ?? character.role}
      </td>
      <td className="text-foreground/90 px-3 py-2 text-sm">{character.itemLevel}</td>

      <td className="px-3 py-2 font-mono text-sm">
        {isPendingRaiderIO ? (
          <Skeleton className="h-4 w-12 rounded" />
        ) : (
          <ScoreCell profileUrl={character.raiderIO?.profileUrl} score={score} />
        )}
      </td>

      <td className="px-3 py-2 font-mono text-sm">
        {isPendingWCL ? (
          <Skeleton className="h-4 w-8 rounded" />
        ) : (
          <LogCell wclUrl={wclUrl} zone={character.warcraftLogs?.heroic} />
        )}
      </td>
      <td className="px-3 py-2 font-mono text-sm">
        {isPendingWCL ? (
          <Skeleton className="h-4 w-8 rounded" />
        ) : (
          <LogCell wclUrl={wclUrl} zone={character.warcraftLogs?.mythic} />
        )}
      </td>

      <td className="px-3 py-2 text-xs">
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
            <span className="text-yellow-600 dark:text-yellow-500">
              M {progression.mythic_bosses_killed}/{progression.total_bosses}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>

      {/* 액션 버튼: 최신화 + 제거 */}
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

// ─── 정렬 아이콘 ─────────────────────────────────────────────────────────────

interface SortIconProps {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}

const SortIcon = ({ column, sortColumn, sortDirection }: SortIconProps) => {
  if (sortColumn !== column) {
    return <span className="text-muted-foreground/30 ml-0.5 text-[10px]">↕</span>
  }
  return (
    <span className="text-primary ml-0.5 text-[10px]">{sortDirection === "asc" ? "↑" : "↓"}</span>
  )
}

// ─── 공격대 목록 (메인 컴포넌트) ─────────────────────────────────────────────

export const RosterList = () => {
  // 변수부 — 스토어
  const characters = useRosterStore((store) => store.characters)
  const clearRoster = useRosterStore((store) => store.clearRoster)

  // 변수부 — 정렬 상태 (URL 쿼리스트링)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawSortColumn = searchParams.get("sort")
  const sortColumn: SortColumn | null =
    rawSortColumn && (SORT_COLUMNS as readonly string[]).includes(rawSortColumn)
      ? (rawSortColumn as SortColumn)
      : null
  const sortDirection: SortDirection = searchParams.get("dir") === "asc" ? "asc" : "desc"

  // 공격대원이 없어지면 정렬 쿼리스트링 초기화
  useEffect(() => {
    if (characters.length === 0 && (searchParams.get("sort") || searchParams.get("dir"))) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("sort")
      params.delete("dir")
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }
  }, [characters.length, pathname, router, searchParams])

  // 변수부 — 커스텀 훅
  const { copyShareUrl, isRefreshing, refreshAll, refreshingIds, refreshOne } = useRosterSync()

  // 함수
  const handleSort = (column: SortColumn) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortColumn === column) {
      params.set("dir", sortDirection === "desc" ? "asc" : "desc")
    } else {
      params.set("sort", column)
      params.set("dir", "desc")
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleCopyLink = () => {
    copyShareUrl()
    toast.success("링크 복사됨!", {
      description: `공격대 ${characters.length}명 링크가 클립보드에 복사됐습니다.`,
    })
  }

  const handleRefreshAll = async () => {
    await refreshAll()
    toast.success("최신화 완료!", { description: "모든 공격대원 데이터가 업데이트됐습니다." })
  }

  // 빈 상태
  if (characters.length === 0) {
    return (
      <section className="border-border/40 bg-card/40 min-w-0 rounded-lg border p-5">
        <p className="text-muted-foreground py-4 text-center text-sm">
          아직 추가된 공격대원이 없습니다.
        </p>
      </section>
    )
  }

  // 파생 데이터 (훅 이후)
  const sorted = sortColumn
    ? sortRoster(characters, sortColumn, sortDirection)
    : [...characters].sort(
        (a, b) => ROLE_SORT_ORDER.indexOf(a.role) - ROLE_SORT_ORDER.indexOf(b.role)
      )

  const roleCounts = characters.reduce<Record<string, number>>((accumulator, character) => {
    accumulator[character.role] = (accumulator[character.role] ?? 0) + 1
    return accumulator
  }, {})

  // 렌더
  return (
    <section className="border-border/40 bg-card/40 rounded-lg border p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-primary font-semibold">공격대 ({characters.length}명)</span>
            <div className="flex gap-2 text-xs">
              {ROLE_SORT_ORDER.filter((role) => roleCounts[role]).map((role) => (
                <span className={ROLE_COLOR[role] ?? ""} key={role}>
                  {ROLE_LABEL[role]} {roleCounts[role]}
                </span>
              ))}
            </div>
          </div>

          {/* 헤더 액션 버튼 */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-sky-400/80 transition-colors hover:bg-sky-400/10 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isRefreshing}
              onClick={handleRefreshAll}
            >
              <span className={`text-sm ${isRefreshing ? "animate-spin" : ""}`}>↻</span>
              {isRefreshing ? "최신화 중…" : "전체 최신화"}
            </button>

            <button
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-emerald-400/80 transition-colors hover:bg-emerald-400/10 hover:text-emerald-400"
              onClick={handleCopyLink}
            >
              🔗 링크 복사
            </button>

            <button
              className="text-muted-foreground/60 text-xs transition-colors hover:text-red-400"
              onClick={clearRoster}
            >
              전체 초기화
            </button>
          </div>
        </div>

        <div className="border-border/40 bg-card/60 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-border/40 text-muted-foreground border-b text-xs">
                <th className="min-w-[160px] px-3 py-2">캐릭터</th>
                {(
                  [
                    { className: "min-w-[90px]", column: "realm", label: "서버" },
                    { className: "min-w-[90px]", column: "className", label: "직업" },
                    { className: "min-w-[80px]", column: "specName", label: "특성" },
                    { className: "min-w-[56px]", column: "faction", label: "진영" },
                    { className: "min-w-[56px]", column: "role", label: "역할" },
                    { className: "min-w-[80px]", column: "itemLevel", label: "아이템레벨" },
                    { className: "min-w-[72px]", column: "score", label: "M+ 점수" },
                    {
                      className: "min-w-[60px] text-blue-600/80 dark:text-blue-400/70",
                      column: "logHeroic",
                      label: "로그 H",
                    },
                    {
                      className: "min-w-[60px] text-yellow-600/80 dark:text-yellow-500/70",
                      column: "logMythic",
                      label: "로그 M",
                    },
                    { className: "min-w-[96px]", column: "raidProgress", label: "레이드 진행" },
                  ] satisfies { column: SortColumn; label: string; className: string }[]
                ).map(({ className, column, label }) => (
                  <th
                    className={`hover:text-foreground cursor-pointer px-3 py-2 transition-colors select-none ${className} ${sortColumn === column ? "text-foreground" : ""}`}
                    key={column}
                    onClick={() => handleSort(column)}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {label}
                      <SortIcon
                        column={column}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                      />
                    </span>
                  </th>
                ))}
                <th className="min-w-[64px] px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((character) => (
                <CharacterRow
                  character={character}
                  isRefreshing={refreshingIds.has(character.id)}
                  key={character.id}
                  onRefresh={() => refreshOne(character.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
