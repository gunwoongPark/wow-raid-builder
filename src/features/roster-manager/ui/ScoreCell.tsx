"use client"

import { cn } from "@/lib/utils"

interface ScoreCellProps {
  profileUrl?: string
  score: number
}

export const ScoreCell = ({ profileUrl, score }: ScoreCellProps) => {
  const colorClass =
    score >= 3000
      ? "font-bold text-orange-500 dark:text-orange-400"
      : score >= 2000
        ? "text-purple-600 dark:text-purple-400"
        : score >= 1000
          ? "text-blue-700 dark:text-blue-400"
          : "text-muted-foreground"

  const text = score > 0 ? score.toLocaleString() : "—"

  if (!profileUrl || score === 0) {
    return <span className={colorClass}>{text}</span>
  }

  return (
    <a
      href={profileUrl}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        colorClass,
        "underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70"
      )}
    >
      {text}
    </a>
  )
}
