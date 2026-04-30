export const scoreColorClass = (score: number): string =>
  score >= 3000
    ? "font-bold text-orange-500 dark:text-orange-400"
    : score >= 2000
      ? "text-purple-600 dark:text-purple-400"
      : score >= 1000
        ? "text-blue-700 dark:text-blue-400"
        : "text-muted-foreground"
