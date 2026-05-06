"use client"

import { type ChangeEvent } from "react"

import { type RosterCharacter, useRosterStore } from "@/entities/character"
import { cn } from "@/lib/utils"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"

import { ROLE_COLOR } from "../config/roster-display"
import { autoAssignParties } from "../lib/auto-assign-parties"
import { PartyCard } from "./PartyCard"

// ─── 상수 ──────────────────────────────────────────────────────────────────────

const PARTY_COUNT = 6

const ROLE_BADGE: Record<string, string> = {
  HEALER: "힐",
  MELEE: "근",
  RANGED: "원",
  TANK: "탱",
}

// ─── UnassignedSlot ────────────────────────────────────────────────────────────

interface UnassignedSlotProps {
  character: RosterCharacter
}

const UnassignedSlot = ({ character }: UnassignedSlotProps) => {
  const assignToParty = useRosterStore((store) => store.assignToParty)

  const classColor = getClassColor(character.className)
  const classColorLight = getClassColorLight(character.className)

  const handlePartyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      assignToParty(character.id, parseInt(value, 10))
    }
  }

  return (
    <div className="border-border/40 bg-card/60 flex items-center gap-1.5 rounded border px-2 py-1.5">
      {/* 클래스 색상 바 */}
      <div
        className="h-4 w-0.5 shrink-0 rounded-full"
        style={{ background: `light-dark(${classColorLight}, ${classColor})` }}
      />

      {/* 역할 배지 */}
      <span className={cn("shrink-0 text-[10px] font-bold", ROLE_COLOR[character.role])}>
        {ROLE_BADGE[character.role] ?? ""}
      </span>

      {/* 이름 */}
      <span
        className="max-w-[88px] truncate text-xs font-semibold"
        style={{ color: `light-dark(${classColorLight}, ${classColor})` }}
      >
        {character.name}
      </span>

      {/* 파티 배정 select */}
      <select
        aria-label={`${character.name} 파티 배정`}
        className="border-border/40 bg-background/60 text-muted-foreground hover:border-border/70 ml-auto cursor-pointer rounded border px-1 py-0.5 text-[10px] transition-colors"
        onChange={handlePartyChange}
        value=""
      >
        <option disabled value="">
          파티 배정
        </option>
        {Array.from({ length: PARTY_COUNT }, (_, i) => (
          <option key={i + 1} value={String(i + 1)}>
            파티 {i + 1}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── PartyFrameView ────────────────────────────────────────────────────────────

export const PartyFrameView = () => {
  const characters = useRosterStore((store) => store.characters)
  const partyAssignments = useRosterStore((store) => store.partyAssignments)
  const setPartyAssignments = useRosterStore((store) => store.setPartyAssignments)
  const clearPartyAssignments = useRosterStore((store) => store.clearPartyAssignments)

  const unassigned = characters.filter((c) => partyAssignments[c.id] === undefined)
  const hasAnyAssignment = characters.some((c) => partyAssignments[c.id] !== undefined)

  const handleAutoAssign = () => setPartyAssignments(autoAssignParties(characters))
  const handleClearAssignments = () => clearPartyAssignments()

  return (
    <div className="flex flex-col gap-4">
      {/* 툴바 */}
      <div className="flex items-center gap-2">
        <button
          className="border-primary/60 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary/70 rounded border px-3 py-1.5 text-xs font-medium transition-colors"
          onClick={handleAutoAssign}
        >
          자동 배치
        </button>
        {hasAnyAssignment && (
          <button
            className="rounded border border-transparent px-3 py-1.5 text-xs text-red-600/70 transition-colors hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400/50 dark:hover:border-red-400/25 dark:hover:text-red-400"
            onClick={handleClearAssignments}
          >
            배정 초기화
          </button>
        )}
        {unassigned.length === 0 && hasAnyAssignment && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ 전원 배정 완료</span>
        )}
      </div>

      {/* 미배정 캐릭터 풀 */}
      {unassigned.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2 text-xs">
            미배정 <span className="text-foreground/60 font-medium">{unassigned.length}명</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((character) => (
              <UnassignedSlot character={character} key={character.id} />
            ))}
          </div>
        </div>
      )}

      {/* 6파티 그리드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PARTY_COUNT }, (_, i) => {
          const partyNumber = i + 1
          const partyCharacters = characters.filter((c) => partyAssignments[c.id] === partyNumber)
          return (
            <PartyCard characters={partyCharacters} key={partyNumber} partyNumber={partyNumber} />
          )
        })}
      </div>
    </div>
  )
}
