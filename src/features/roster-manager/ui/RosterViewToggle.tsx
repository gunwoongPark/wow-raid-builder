"use client"

import { cn } from "@/lib/utils"

export type RosterView = "list" | "party"

interface RosterViewToggleProps {
  onViewChange: (view: RosterView) => void
  view: RosterView
}

export const RosterViewToggle = ({ onViewChange, view }: RosterViewToggleProps) => {
  const handleList = () => onViewChange("list")
  const handleParty = () => onViewChange("party")

  return (
    <div className="border-border/60 flex overflow-hidden rounded border text-xs">
      <button
        onClick={handleList}
        className={cn(
          "px-2.5 py-1 transition-colors",
          view === "list"
            ? "bg-primary/15 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        목록
      </button>
      <div className="bg-border/60 w-px" />
      <button
        onClick={handleParty}
        className={cn(
          "px-2.5 py-1 transition-colors",
          view === "party"
            ? "bg-primary/15 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        파티 프레임
      </button>
    </div>
  )
}
