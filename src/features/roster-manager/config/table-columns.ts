import { type SortColumn } from "../lib/sort-roster"

interface HeaderColumn {
  className: string
  column: SortColumn
}

// Labels are resolved in the component via useTranslations("roster.column")
// Column min-widths are calibrated for max-w-7xl (1280px) layout
export const HEADER_COLUMNS: HeaderColumn[] = [
  { className: "min-w-[80px]", column: "realm" },
  { className: "min-w-[80px]", column: "className" },
  { className: "min-w-[80px]", column: "specName" },
  { className: "min-w-[56px]", column: "faction" },
  { className: "min-w-[56px]", column: "role" },
  { className: "min-w-[70px]", column: "itemLevel" },
  { className: "min-w-[70px]", column: "score" },
  {
    className: "min-w-[56px] text-blue-600/80 dark:text-blue-400/70",
    column: "logHeroic",
  },
  {
    className: "min-w-[56px] text-yellow-600/80 dark:text-yellow-500/70",
    column: "logMythic",
  },
  { className: "min-w-[88px]", column: "raidProgress" },
]
