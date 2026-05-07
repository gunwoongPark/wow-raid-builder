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
import { arrayMove } from "@dnd-kit/sortable"
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
    <div className="border-border/60 bg-card flex w-max cursor-grabbing items-center gap-2 rounded-md border py-1.5 pr-4 pl-3 shadow-2xl">
      <div
        className="h-5 w-0.5 shrink-0 rounded-full"
        style={{ background: `light-dark(${classColorLight}, ${classColor})` }}
      />
      <span
        className={cn("w-3 shrink-0 text-center text-[10px] font-bold", ROLE_COLOR[character.role])}
      >
        {ROLE_BADGE[character.role] ?? ""}
      </span>
      <div>
        <p
          className="text-xs font-semibold whitespace-nowrap"
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
        "border-border/40 bg-card/60 flex cursor-grab items-center gap-1.5 rounded border py-1 pr-3 pl-2 active:cursor-grabbing",
        isDragging && "opacity-30"
      )}
      {...listeners}
      {...attributes}
    >
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
        className="text-xs font-semibold whitespace-nowrap"
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
  const [activeId, setActiveId] = useState<string | null>(null)

  const characters = useRosterStore((store) => store.characters)
  const partyAssignments = useRosterStore((store) => store.partyAssignments)
  const partyOrder = useRosterStore((store) => store.partyOrder)
  const assignToParty = useRosterStore((store) => store.assignToParty)
  const unassignFromParty = useRosterStore((store) => store.unassignFromParty)
  const reorderParty = useRosterStore((store) => store.reorderParty)
  const setPartyAssignments = useRosterStore((store) => store.setPartyAssignments)
  const clearPartyAssignments = useRosterStore((store) => store.clearPartyAssignments)

  const sensors = useSensors(
    useSensor(PointerSensor, {
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

    // 1. 미배정 풀로 드롭 → 배정 해제
    if (dropTarget === "pool") {
      if (currentParty !== undefined) unassignFromParty(characterId)
      return
    }

    // 2. 파티 카드 빈 공간으로 드롭 → 파티 이동
    if (dropTarget.startsWith("party-")) {
      const partyNumber = parseInt(dropTarget.replace("party-", ""), 10)
      if (isNaN(partyNumber) || currentParty === partyNumber) return
      const partySize = characters.filter((c) => partyAssignments[c.id] === partyNumber).length
      if (partySize >= MAX_PARTY_SIZE) return
      assignToParty(characterId, partyNumber)
      return
    }

    // 3. 다른 캐릭터 슬롯으로 드롭 → 같은 파티면 순서 변경, 다른 파티면 이동
    const overCharacter = characters.find((c) => c.id === dropTarget)
    if (!overCharacter) return

    const overParty = partyAssignments[overCharacter.id]

    if (overParty === currentParty && currentParty !== undefined) {
      // 파티 내 순서 변경
      const currentOrder = partyOrder[currentParty] ?? []
      const oldIndex = currentOrder.indexOf(characterId)
      const newIndex = currentOrder.indexOf(dropTarget)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderParty(currentParty, arrayMove(currentOrder, oldIndex, newIndex))
      }
    } else if (overParty !== undefined) {
      // 다른 파티의 캐릭터 위로 드롭 → 그 파티로 이동
      const partySize = characters.filter((c) => partyAssignments[c.id] === overParty).length
      if (partySize >= MAX_PARTY_SIZE) return
      assignToParty(characterId, overParty)
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
            const orderedIds = partyOrder[partyNumber] ?? []
            // partyOrder 기반으로 순서 유지, store에서 캐릭터 조회
            const partyCharacters = orderedIds
              .map((id) => characters.find((c) => c.id === id))
              .filter((c): c is RosterCharacter => c !== undefined)
            return (
              <PartyCard
                characterIds={orderedIds}
                characters={partyCharacters}
                isDragging={isDragging}
                key={partyNumber}
                partyNumber={partyNumber}
              />
            )
          })}
        </div>
      </div>

      {/* 드래그 오버레이 */}
      <DragOverlay>
        {activeCharacter && <CharacterDragCard character={activeCharacter} />}
      </DragOverlay>
    </DndContext>
  )
}
