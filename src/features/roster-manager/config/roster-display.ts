export const ROLE_COLOR: Record<string, string> = {
  HEALER: "text-emerald-600 dark:text-emerald-400",
  MELEE: "text-red-600 dark:text-red-400",
  RANGED: "text-sky-600 dark:text-sky-400",
  TANK: "text-blue-700 dark:text-blue-400",
}

export const ROLE_SORT_ORDER = ["TANK", "HEALER", "MELEE", "RANGED"]

export const FACTION_CLASS: Record<string, string> = {
  alliance: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  horde: "bg-red-500/15 text-red-700 dark:text-red-400",
}
