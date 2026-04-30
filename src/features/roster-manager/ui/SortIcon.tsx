"use client"

import { type SortColumn, type SortDirection } from "../lib/sort-roster"

interface SortIconProps {
  column: SortColumn
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}

export const SortIcon = ({ column, sortColumn, sortDirection }: SortIconProps) => {
  if (sortColumn !== column) {
    return <span className="text-muted-foreground/30 ml-0.5 text-[10px]">↕</span>
  }
  return (
    <span className="text-primary ml-0.5 text-[10px]">{sortDirection === "asc" ? "↑" : "↓"}</span>
  )
}
