"use client"

import { cn } from "@/lib/utils"

import { type SortColumn, type SortDirection } from "../lib/sort-roster"

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
