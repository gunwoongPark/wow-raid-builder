"use client"

import { Link } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

import { useRosterStore } from "@/entities/character"

import { ROLE_COLOR, ROLE_LABEL, ROLE_SORT_ORDER } from "../config/roster-display"
import { HEADER_COLUMNS } from "../config/table-columns"
import { SORT_COLUMNS, type SortColumn, type SortDirection, sortRoster } from "../lib/sort-roster"
import { useRosterSync } from "../model/useRosterSync"
import { CharacterRow } from "./CharacterRow"
import { SortableHeaderCell } from "./SortableHeaderCell"

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="text-primary shrink-0 font-bold tracking-wide">
              공격대{" "}
              <span className="text-primary/60 text-sm font-normal">({characters.length}명)</span>
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {ROLE_SORT_ORDER.filter((role) => roleCounts[role]).map((role) => (
                <span className={ROLE_COLOR[role] ?? ""} key={role}>
                  {ROLE_LABEL[role]} {roleCounts[role]}
                </span>
              ))}
            </div>
          </div>

          {/* 헤더 액션 버튼 */}
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <button
              className="flex items-center gap-1 rounded border border-transparent px-2 py-1 text-xs text-sky-700 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-sky-400/70 dark:hover:border-sky-400/30 dark:hover:text-sky-400"
              disabled={isRefreshing}
              onClick={handleRefreshAll}
            >
              <span className={`text-sm leading-none ${isRefreshing ? "animate-spin" : ""}`}>
                ↻
              </span>
              {isRefreshing ? "최신화 중…" : "전체 최신화"}
            </button>

            <button
              className="flex items-center gap-1 rounded border border-transparent px-2 py-1 text-xs text-emerald-700 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400/70 dark:hover:border-emerald-400/30 dark:hover:text-emerald-400"
              onClick={handleCopyLink}
            >
              <Link className="size-3" />
              링크 복사
            </button>

            <button
              className="rounded border border-transparent px-2 py-1 text-xs text-red-600/70 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400/40 dark:hover:border-red-400/25 dark:hover:text-red-400"
              onClick={clearRoster}
            >
              전체 초기화
            </button>
          </div>
        </div>

        <div className="border-border/60 bg-card/95 min-w-0 overflow-x-auto rounded-md border">
          <table aria-label="공격대 목록" className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-border/50 text-muted-foreground border-b bg-black/3 text-xs dark:bg-black/40">
                <th className="min-w-[160px] px-3 py-2" scope="col">
                  캐릭터
                </th>
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
                <th className="min-w-[64px] px-3 py-2" scope="col">
                  <span className="sr-only">액션</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((character) => (
                <CharacterRow
                  character={character}
                  isRefreshing={refreshingIds.has(character.id) || isRefreshing}
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
