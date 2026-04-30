import { type SortColumn } from "../lib/sort-roster"

interface HeaderColumn {
  className: string
  column: SortColumn
  label: string
}

export const HEADER_COLUMNS: HeaderColumn[] = [
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
]
