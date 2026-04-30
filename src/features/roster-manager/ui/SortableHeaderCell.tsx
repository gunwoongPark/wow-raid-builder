"use client"

import { cn } from "@/lib/utils"

import { type SortColumn, type SortDirection } from "../lib/sort-roster"
import { SortIcon } from "./SortIcon"

interface SortableHeaderCellProps {
  className: string
  column: SortColumn
  label: string
  onSort: (column: SortColumn) => void
  sortColumn: SortColumn | null
  sortDirection: SortDirection
}

export const SortableHeaderCell = ({
  className,
  column,
  label,
  onSort,
  sortColumn,
  sortDirection,
}: SortableHeaderCellProps) => {
  const handleClick = () => onSort(column)

  return (
    <th
      onClick={handleClick}
      scope="col"
      aria-sort={
        sortColumn === column ? (sortDirection === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn(
        "hover:text-foreground cursor-pointer px-3 py-2 transition-colors select-none",
        className,
        sortColumn === column && "text-foreground"
      )}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        <SortIcon column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
      </span>
    </th>
  )
}
