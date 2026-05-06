"use client"

import { type ChangeEvent } from "react"

import { type RosterCharacter, useRosterStore } from "@/entities/character"
import { cn } from "@/lib/utils"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"

import { ROLE_COLOR } from "../config/roster-display"

// ─── 상수 ──────────────────────────────────────────────────────────────────────

const MAX_PARTY_SIZE = 5
const PARTY_COUNT = 6

const ROLE_BADGE: Record<string, string> = {
  HEALER: "힐",
  MELEE: "근",
  RANGED: "원",
  TANK: "탱",
}

// ─── CharacterSlot ─────────────────────────────────────────────────────────────

interface CharacterSlotProps {
  character: RosterCharacter
  currentParty: number
}

const CharacterSlot = ({ character, currentParty }: CharacterSlotProps) => {
  const assignToParty = useRosterStore((store) => store.assignToParty)
  const unassignFromParty = useRosterStore((store) => store.unassignFromParty)

  const classColor = getClassColor(character.className)
  const classColorLight = getClassColorLight(character.className)

  const handlePartyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!value) {
      unassignFromParty(character.id)
    } else {
      assignToParty(character.id, parseInt(value, 10))
    }
  }

  const handleUnassign = () => unassignFromParty(character.id)

  return (
    <div className="border-border/20 flex items-center gap-2 border-b px-3 py-1.5 last:border-0">
      {/* 클래스 색상 좌측 바 */}
      <div
        className="h-5 w-0.5 shrink-0 rounded-full"
        style={{ background: `light-dark(${classColorLight}, ${classColor})` }}
      />

      {/* 역할 배지 */}
      <span
        className={cn("w-3 shrink-0 text-center text-[10px] font-bold", ROLE_COLOR[character.role])}
      >
        {ROLE_BADGE[character.role] ?? ""}
      </span>

      {/* 이름 + 아이템레벨 */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-xs font-semibold"
          style={{ color: `light-dark(${classColorLight}, ${classColor})` }}
        >
          {character.name}
        </p>
        <p className="text-muted-foreground text-[10px]">{character.itemLevel}</p>
      </div>

      {/* 파티 이동 select */}
      <select
        aria-label={`${character.name} 파티 이동`}
        className="border-border/40 bg-background/60 text-muted-foreground hover:border-border/70 cursor-pointer rounded border px-1 py-0.5 text-[10px] transition-colors"
        onChange={handlePartyChange}
        value={String(currentParty)}
      >
        {Array.from({ length: PARTY_COUNT }, (_, i) => (
          <option key={i + 1} value={String(i + 1)}>
            P{i + 1}
          </option>
        ))}
        <option value="">해제</option>
      </select>

      {/* 해제 버튼 */}
      <button
        aria-label={`${character.name} 파티 배정 해제`}
        className="text-muted-foreground/30 shrink-0 text-xs transition-colors hover:text-red-500"
        onClick={handleUnassign}
        title="배정 해제"
      >
        ✕
      </button>
    </div>
  )
}

// ─── EmptySlot ─────────────────────────────────────────────────────────────────

const EmptySlot = () => (
  <div className="border-border/10 text-muted-foreground/30 flex items-center gap-2 border-b px-3 py-1.5 text-[10px] last:border-0">
    <div className="h-5 w-0.5 shrink-0 rounded-full bg-transparent" />
    <span className="select-none">· · · 빈 슬롯</span>
  </div>
)

// ─── PartyCard ─────────────────────────────────────────────────────────────────

interface PartyCardProps {
  characters: RosterCharacter[]
  partyNumber: number
}

export const PartyCard = ({ characters, partyNumber }: PartyCardProps) => {
  const isEmpty = characters.length === 0

  // 역할 구성 요약 (탱 힐 딜)
  const tankCount = characters.filter((c) => c.role === "TANK").length
  const healerCount = characters.filter((c) => c.role === "HEALER").length
  const dpsCount = characters.filter((c) => c.role === "MELEE" || c.role === "RANGED").length

  const emptySlotCount = MAX_PARTY_SIZE - characters.length

  return (
    <div
      className={cn(
        "wow-panel border-border/60 bg-card/90 rounded-lg border",
        isEmpty && "border-border/30 bg-card/40 opacity-60"
      )}
    >
      {/* 헤더 */}
      <div className="border-border/40 flex items-center justify-between border-b px-3 py-2">
        <span className="text-primary/80 text-xs font-bold tracking-wide">파티 {partyNumber}</span>
        {!isEmpty && (
          <div className="flex items-center gap-1.5 text-[10px]">
            {tankCount > 0 && (
              <span className="text-blue-700 dark:text-blue-400">탱{tankCount}</span>
            )}
            {healerCount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400">힐{healerCount}</span>
            )}
            {dpsCount > 0 && <span className="text-muted-foreground">딜{dpsCount}</span>}
            <span className="text-muted-foreground/40">
              {characters.length}/{MAX_PARTY_SIZE}
            </span>
          </div>
        )}
        {isEmpty && <span className="text-muted-foreground/40 text-[10px]">비어있음</span>}
      </div>

      {/* 슬롯 목록 */}
      <div>
        {characters.map((character) => (
          <CharacterSlot character={character} currentParty={partyNumber} key={character.id} />
        ))}
        {Array.from({ length: emptySlotCount }, (_, i) => (
          <EmptySlot key={`empty-${partyNumber}-${i}`} />
        ))}
      </div>
    </div>
  )
}
