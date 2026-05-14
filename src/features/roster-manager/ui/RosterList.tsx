"use client"

import { Link } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

import { useRosterStore } from "@/entities/character"

import { ROLE_COLOR, ROLE_SORT_ORDER } from "../config/roster-display"
import { HEADER_COLUMNS } from "../config/table-columns"
import { countByRole } from "../lib/roster-stats"
import { SORT_COLUMNS, type SortColumn, type SortDirection, sortRoster } from "../lib/sort-roster"
import { useRosterSync } from "../model/useRosterSync"
import { CharacterRow } from "./CharacterRow"
import { PartyFrameView } from "./PartyFrameView"
import { type RosterView, RosterViewToggle } from "./RosterViewToggle"
import { SortableHeaderCell } from "./SortableHeaderCell"

export const RosterList = () => {
  const characters = useRosterStore((store) => store.characters)
  const clearRoster = useRosterStore((store) => store.clearRoster)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawView = searchParams.get("view")
  const view: RosterView = rawView === "party" ? "party" : "list"

  const rawSortColumn = searchParams.get("sort")
  const isSortColumn = (value: string): value is SortColumn =>
    (SORT_COLUMNS as readonly string[]).includes(value)
  const sortColumn: SortColumn | null =
    rawSortColumn && isSortColumn(rawSortColumn) ? rawSortColumn : null
  const sortDirection: SortDirection = searchParams.get("dir") === "asc" ? "asc" : "desc"

  const { copyShareUrl, isRefreshing, refreshAll, refreshingIds, refreshOne } = useRosterSync()

  const t = useTranslations("roster")
  const tRole = useTranslations("role")
  const tColumn = useTranslations("roster.column")

  const handleViewChange = (nextView: RosterView) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextView === "list") {
      params.delete("view")
    } else {
      params.set("view", nextView)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleSort = (column: SortColumn) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortColumn === column) {
      if (sortDirection === "desc") {
        params.set("dir", "asc")
      } else {
        params.delete("sort")
        params.delete("dir")
      }
    } else {
      params.set("sort", column)
      params.set("dir", "desc")
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleCopyLink = () => {
    copyShareUrl()
    toast.success(t("toast.linkCopied"), {
      description: t("toast.linkCopiedDesc", { count: characters.length }),
    })
  }

  const handleRefreshAll = async () => {
    await refreshAll()
    toast.success(t("toast.refreshDone"), { description: t("toast.refreshDoneDesc") })
  }

  useEffect(() => {
    if (
      characters.length === 0 &&
      (searchParams.get("sort") || searchParams.get("dir") || searchParams.get("view"))
    ) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("sort")
      params.delete("dir")
      params.delete("view")
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }
  }, [characters.length, pathname, router, searchParams])

  if (characters.length === 0) {
    return (
      <section className="wow-panel border-border/60 bg-card/90 min-w-0 rounded-lg border p-5">
        <p className="text-muted-foreground py-4 text-center text-sm">{t("empty")}</p>
      </section>
    )
  }

  const sorted = sortColumn
    ? sortRoster(characters, sortColumn, sortDirection)
    : [...characters].sort(
        (a, b) => ROLE_SORT_ORDER.indexOf(a.role) - ROLE_SORT_ORDER.indexOf(b.role)
      )

  const roleCounts = countByRole(characters)

  const columnLabels: Record<string, string> = {
    className: tColumn("class"),
    faction: tColumn("faction"),
    itemLevel: tColumn("itemLevel"),
    logHeroic: tColumn("logHeroic"),
    logMythic: tColumn("logMythic"),
    raidProgress: tColumn("raidProgress"),
    realm: tColumn("realm"),
    role: tColumn("role"),
    score: tColumn("score"),
    specName: tColumn("spec"),
  }

  return (
    <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="text-primary shrink-0 font-bold tracking-wide">
              {t("sectionTitle")}{" "}
              <span className="text-primary/60 text-sm font-normal">
                {t("memberCount", { count: characters.length })}
              </span>
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {ROLE_SORT_ORDER.filter((role) => roleCounts[role]).map((role) => (
                <span className={ROLE_COLOR[role] ?? ""} key={role}>
                  {tRole(role)} {roleCounts[role]}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <RosterViewToggle onViewChange={handleViewChange} view={view} />

            <button
              className="flex items-center gap-1 rounded border border-transparent px-2 py-1 text-xs text-sky-700 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-sky-400/70 dark:hover:border-sky-400/30 dark:hover:text-sky-400"
              disabled={isRefreshing}
              onClick={handleRefreshAll}
            >
              <span className={`text-sm leading-none ${isRefreshing ? "animate-spin" : ""}`}>
                ↻
              </span>
              {isRefreshing ? t("action.refreshing") : t("action.refreshAll")}
            </button>

            <button
              className="flex items-center gap-1 rounded border border-transparent px-2 py-1 text-xs text-emerald-700 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400/70 dark:hover:border-emerald-400/30 dark:hover:text-emerald-400"
              onClick={handleCopyLink}
            >
              <Link className="size-3" />
              {t("action.copyLink")}
            </button>

            <button
              className="rounded border border-transparent px-2 py-1 text-xs text-red-600/70 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400/40 dark:hover:border-red-400/25 dark:hover:text-red-400"
              onClick={clearRoster}
            >
              {t("action.clearAll")}
            </button>
          </div>
        </div>

        {view === "list" ? (
          <div className="border-border/60 bg-card/95 min-w-0 overflow-x-auto rounded-md border">
            <table aria-label={t("ariaLabel")} className="w-full min-w-[1060px] text-left">
              <thead>
                <tr className="border-border/50 text-muted-foreground border-b bg-black/3 text-xs dark:bg-black/40">
                  <th className="min-w-[160px] px-3 py-2" scope="col">
                    {tColumn("character")}
                  </th>
                  {HEADER_COLUMNS.map(({ className, column }) => (
                    <SortableHeaderCell
                      className={className}
                      column={column}
                      key={column}
                      label={columnLabels[column] ?? column}
                      onSort={handleSort}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  ))}
                  <th className="min-w-[64px] px-3 py-2" scope="col">
                    <span className="sr-only">{tColumn("actions")}</span>
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
        ) : (
          <PartyFrameView />
        )}
      </div>
    </section>
  )
}
