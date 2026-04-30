"use client"

import { cn } from "@/lib/utils"

import { scoreColorClass } from "../lib/score-color"

interface ScoreCellProps {
  profileUrl?: string
  score: number
}

export const ScoreCell = ({ profileUrl, score }: ScoreCellProps) => {
  const text = score > 0 ? score.toLocaleString() : "—"

  if (!profileUrl || score === 0) {
    return <span className={scoreColorClass(score)}>{text}</span>
  }

  return (
    <a
      href={profileUrl}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        scoreColorClass(score),
        "underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70"
      )}
    >
      {text}
    </a>
  )
}
