"use client"

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { GripVertical } from "lucide-react"
import { useState } from "react"

import { type RosterCharacter, useRosterStore } from "@/entities/character"
import { cn } from "@/lib/utils"
import { getClassColor, getClassColorLight } from "@/shared/config/class-colors"

import { ROLE_COLOR } from "../config/roster-display"
import { autoAssignParties } from "../lib/auto-assign-parties"
import { MAX_PARTY_SIZE, PARTY_COUNT, PartyCard, ROLE_BADGE } from "./PartyCard"

// ─── CharacterDragCard (DragOverlay 전용) ──────────────────────────────────────

interface CharacterDragCardProps {
  character: RosterCharacter
}

const CharacterDragCard = ({ character }: CharacterDragCardProps) => {
  const classColor = getClassColor(character.className)
  const classColorLight = getClassColorLight(character.className)

  return (
    <div className="border-border/60 bg-card flex cursor-grabbing items-center gap-2 rounded-md border px-3 py-1.5 shadow-2xl">
      <GripVertical className="text-muted-foreground/40 size-3 shrink-0" />
      <div
        className="h-5 w-0.5 shrink-0 rounded-full"
        style={{ background: `light-dark(${classColorLight}, ${classColor})` }}
      />
      <span
        className={cn("w-3 shrink-0 text-center text-[10px] font-bold", ROLE_COLOR[character.role])}
      >
        {ROLE_BADGE[character.role] ?? ""}
      </span>
      <div className="min-w-0">
        <p
          className="truncate text-xs font-semibold"
          style={{ color: `light-dark(${classColorLight}, ${classColor})` }}
        >
          {character.name}
        </p>
        <p className="text-muted-foreground text-[10px]">{character.itemLevel}</p>
      </div>
    </div>
  )
}

// ─── UnassignedSlot (Draggable) ────────────────────────────────────────────────

interface UnassignedSlotProps {
  character: RosterCharacter
}

const UnassignedSlot = ({ character }: UnassignedSlotProps) => {
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: character.id,
  })

  const classColor = getClassColor(character.className)
  const classColorLight = getClassColorLight(character.className)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-border/40 bg-card/60 flex items-center gap-1.5 rounded border",
        isDragging && "opacity-30"
      )}
    >
      {/* 드래그 핸들 */}
      <div
        className="text-muted-foreground/30 hover:text-muted-foreground/60 cursor-grab pl-2 transition-colors active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-3" />
      </div>

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
        className="max-w-[88px] truncate pr-2 text-xs font-semibold"
        style={{ color: `light-dark(${classColorLight}, ${classColor})` }}
      >
        {character.name}
      </span>
    </div>
  )
}

// ─── UnassignedPool (Droppable) ────────────────────────────────────────────────

interface UnassignedPoolProps {
  characters: RosterCharacter[]
  isDragging: boolean
}

const UnassignedPool = ({ characters, isDragging }: UnassignedPoolProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: "pool" })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border border-dashed p-3 transition-colors",
        isOver ? "border-primary/50 bg-primary/5" : "border-border/40",
        isDragging && characters.length === 0 && "border-primary/30 bg-primary/[0.03]"
      )}
    >
      <p className="text-muted-foreground mb-2 text-xs">
        미배정 <span className="text-foreground/60 font-medium">{characters.length}명</span>
        {isDragging && (
          <span className="text-primary/60 ml-2 text-[10px]">← 여기에 놓으면 배정 해제</span>
        )}
      </p>
      {characters.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {characters.map((character) => (
            <UnassignedSlot character={character} key={character.id} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground/40 text-xs">전원 파티 배정 완료 ✓</p>
      )}
    </div>
  )
}

// ─── PartyFrameView ────────────────────────────────────────────────────────────

export const PartyFrameView = () => {
  const characters = useRosterStore((store) => store.characters)
  const partyAssignments = useRosterStore((store) => store.partyAssignments)
  const assignToParty = useRosterStore((store) => store.assignToParty)
  const unassignFromParty = useRosterStore((store) => store.unassignFromParty)
  const setPartyAssignments = useRosterStore((store) => store.setPartyAssignments)
  const clearPartyAssignments = useRosterStore((store) => store.clearPartyAssignments)

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // 5px 이동 후 드래그 시작 — 버튼 클릭과 충돌 방지
      activationConstraint: { distance: 5 },
    })
  )

  const activeCharacter = activeId ? (characters.find((c) => c.id === activeId) ?? null) : null

  const unassigned = characters.filter((c) => partyAssignments[c.id] === undefined)
  const hasAnyAssignment = characters.some((c) => partyAssignments[c.id] !== undefined)
  const isDragging = activeId !== null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const characterId = String(active.id)
    const dropTarget = String(over.id)
    const currentParty = partyAssignments[characterId]

    if (dropTarget === "pool") {
      if (currentParty !== undefined) unassignFromParty(characterId)
      return
    }

    if (dropTarget.startsWith("party-")) {
      const partyNumber = parseInt(dropTarget.replace("party-", ""), 10)
      if (isNaN(partyNumber) || currentParty === partyNumber) return

      // 정원 초과 시 드롭 무시
      const partySize = characters.filter((c) => partyAssignments[c.id] === partyNumber).length
      if (partySize >= MAX_PARTY_SIZE) return

      assignToParty(characterId, partyNumber)
    }
  }

  const handleAutoAssign = () => setPartyAssignments(autoAssignParties(characters))
  const handleClearAssignments = () => clearPartyAssignments()

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
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
        </div>

        {/* 미배정 풀 */}
        <UnassignedPool characters={unassigned} isDragging={isDragging} />

        {/* 6파티 그리드 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PARTY_COUNT }, (_, i) => {
            const partyNumber = i + 1
            const partyCharacters = characters.filter((c) => partyAssignments[c.id] === partyNumber)
            return (
              <PartyCard
                characters={partyCharacters}
                isDragging={isDragging}
                key={partyNumber}
                partyNumber={partyNumber}
              />
            )
          })}
        </div>
      </div>

      {/* 드래그 오버레이 — DndContext 내부에 있어야 포인터 위치 추적 */}
      <DragOverlay>
        {activeCharacter && <CharacterDragCard character={activeCharacter} />}
      </DragOverlay>
    </DndContext>
  )
}
