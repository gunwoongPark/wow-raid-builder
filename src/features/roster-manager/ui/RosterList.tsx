"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

import { useRosterStore } from "@/entities/character"

import { ROLE_COLOR, ROLE_LABEL, ROLE_SORT_ORDER } from "../config/roster-display"
import { SORT_COLUMNS, type SortColumn, type SortDirection, sortRoster } from "../lib/sort-roster"
import { useRosterSync } from "../model/useRosterSync"
import { CharacterRow } from "./CharacterRow"
import { SortableHeaderCell } from "./SortableHeaderCell"

const HEADER_COLUMNS = [
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
] satisfies { className: string; column: SortColumn; label: string }[]

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
      <section className="wow-panel border-border/60 bg-card/90 min-w-0 rounded-lg border p-5">
        <p className="text-muted-foreground py-4 text-center text-sm">
          아직 추가된 공격대원이 없습니다.
        </p>
      </section>
    )
  }

  // 파생 데이터
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
    <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="fantasy text-primary font-bold tracking-wide">
              공격대{" "}
              <span className="text-primary/60 text-sm font-normal">({characters.length}명)</span>
            </span>
            <div className="flex gap-2 text-xs">
              {ROLE_SORT_ORDER.filter((role) => roleCounts[role]).map((role) => (
                <span className={ROLE_COLOR[role] ?? ""} key={role}>
                  {ROLE_LABEL[role]} {roleCounts[role]}
                </span>
              ))}
            </div>
          </div>

          {/* 헤더 액션 버튼 */}
          <div className="flex items-center gap-1.5">
            <button
              className="flex items-center gap-1 rounded border border-transparent px-2 py-1 text-xs text-sky-500/70 transition-all hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-40 dark:text-sky-400/70"
              disabled={isRefreshing}
              onClick={handleRefreshAll}
            >
              <span className={`text-sm leading-none ${isRefreshing ? "animate-spin" : ""}`}>
                ↻
              </span>
              {isRefreshing ? "최신화 중…" : "전체 최신화"}
            </button>

            <button
              className="flex items-center gap-1 rounded border border-transparent px-2 py-1 text-xs text-emerald-600/70 transition-all hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-500 dark:text-emerald-400/70 dark:hover:text-emerald-400"
              onClick={handleCopyLink}
            >
              ⛓ 링크 복사
            </button>

            <button
              className="rounded border border-transparent px-2 py-1 text-xs text-red-400/40 transition-all hover:border-red-400/25 hover:bg-red-400/8 hover:text-red-400"
              onClick={clearRoster}
            >
              전체 초기화
            </button>
          </div>
        </div>

        <div className="border-border/60 bg-card/95 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-border/50 text-muted-foreground border-b bg-black/3 text-xs dark:bg-black/40">
                <th className="min-w-[160px] px-3 py-2">캐릭터</th>
                {HEADER_COLUMNS.map(({ className, column, label }) => (
                  <SortableHeaderCell
                    className={className}
                    column={column}
                    key={column}
                    label={label}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
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
                  onRefresh={refreshOne}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
