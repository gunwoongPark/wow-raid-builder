"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { type RosterCharacter, useRosterStore } from "@/entities/character"
import { cn } from "@/lib/utils"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"

import { DND_IDS } from "../config/dnd"
import { MAX_PARTY_SIZE, PARTY_COUNT } from "../config/party"
import { ROLE_COLOR } from "../config/roster-display"
import { countByRole } from "../lib/roster-stats"

export { MAX_PARTY_SIZE, PARTY_COUNT }

// 슬롯 고정 높이 — CharacterSlot / EmptySlot 동일 적용으로 layout shift 방지
const SLOT_HEIGHT = "h-[46px]"

export const ROLE_BADGE: Record<string, string> = {
  HEALER: "힐",
  MELEE: "근",
  RANGED: "원",
  TANK: "탱",
}

// ─── CharacterSlot (Sortable + Draggable) ──────────────────────────────────────

interface CharacterSlotProps {
  character: RosterCharacter
}

export const CharacterSlot = ({ character }: CharacterSlotProps) => {
  const unassignFromParty = useRosterStore((store) => store.unassignFromParty)
  const { attributes, isDragging, listeners, setNodeRef } = useSortable({
    id: character.id,
  })

  const classColor = getClassColor(character.className)
  const classColorLight = getClassColorLight(character.className)

  const handleUnassign = () => unassignFromParty(character.id)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-border/20 flex cursor-grab items-center gap-2 border-b px-2 last:border-0 active:cursor-grabbing",
        SLOT_HEIGHT,
        isDragging && "opacity-30"
      )}
      {...listeners}
      {...attributes}
    >
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
  <div
    className={cn(
      "border-border/10 text-muted-foreground/25 flex items-center gap-2 border-b px-2 text-[10px] last:border-0",
      SLOT_HEIGHT
    )}
  >
    <div className="size-3 shrink-0" />
    <div className="h-5 w-0.5 shrink-0 rounded-full bg-transparent" />
    <span className="select-none">· · · 빈 슬롯</span>
  </div>
)

// ─── PartyCard (Droppable + SortableContext) ────────────────────────────────────

interface PartyCardProps {
  characterIds: string[]
  characters: RosterCharacter[]
  isDragging: boolean
  partyNumber: number
}

export const PartyCard = ({
  characterIds,
  characters,
  isDragging,
  partyNumber,
}: PartyCardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: `${DND_IDS.PARTY_PREFIX}${partyNumber}` })
  const isFull = characters.length >= MAX_PARTY_SIZE
  const isEmpty = characters.length === 0

  const roleCounts = countByRole(characters)
  const emptySlotCount = MAX_PARTY_SIZE - characters.length

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "wow-panel rounded-lg border transition-colors",
        isEmpty && !isDragging
          ? "border-border/30 bg-card/40 opacity-60"
          : "border-border/60 bg-card/90",
        isDragging && isEmpty && "border-border/40 bg-card/60 opacity-100",
        isOver && !isFull && "border-primary/50 bg-primary/5",
        isOver && isFull && "border-red-400/40 bg-red-500/5"
      )}
    >
      {/* 헤더 */}
      <div className="border-border/40 flex items-center justify-between border-b px-3 py-2">
        <span className="text-primary/80 text-xs font-bold tracking-wide">파티 {partyNumber}</span>
        {!isEmpty ? (
          <div className="flex items-center gap-1.5 text-[10px]">
            {(roleCounts.TANK ?? 0) > 0 && (
              <span className="text-blue-700 dark:text-blue-400">탱{roleCounts.TANK}</span>
            )}
            {(roleCounts.HEALER ?? 0) > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400">힐{roleCounts.HEALER}</span>
            )}
            {(roleCounts.MELEE ?? 0) > 0 && (
              <span className="text-red-600 dark:text-red-400">근{roleCounts.MELEE}</span>
            )}
            {(roleCounts.RANGED ?? 0) > 0 && (
              <span className="text-sky-600 dark:text-sky-400">원{roleCounts.RANGED}</span>
            )}
            <span
              className={cn(
                "text-muted-foreground/40",
                isFull && "text-amber-600/60 dark:text-amber-400/60"
              )}
            >
              {characters.length}/{MAX_PARTY_SIZE}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/40 text-[10px]">
            {isDragging ? "여기에 놓기" : "비어있음"}
          </span>
        )}
      </div>

      {/* 슬롯 목록 */}
      <SortableContext items={characterIds} strategy={verticalListSortingStrategy}>
        <div>
          {characters.map((character) => (
            <CharacterSlot character={character} key={character.id} />
          ))}
          {Array.from({ length: emptySlotCount }, (_, i) => (
            <EmptySlot key={`empty-${partyNumber}-${i}`} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
