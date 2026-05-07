import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type RosterCharacter } from "../types"

export const MAX_ROSTER_SIZE = 30

interface RosterState {
  characters: RosterCharacter[]
  partyAssignments: Record<string, number>
  partyOrder: Record<number, string[]>
  pendingRaiderIOIds: Set<string>
  pendingWCLIds: Set<string>
  addCharacter: (character: RosterCharacter) => void
  removeCharacter: (id: string) => void
  updateCharacter: (id: string, updates: Partial<RosterCharacter>) => void
  clearRoster: () => void
  assignToParty: (id: string, partyNumber: number) => void
  unassignFromParty: (id: string) => void
  setPartyAssignments: (assignments: Record<string, number>) => void
  clearPartyAssignments: () => void
  reorderParty: (partyNumber: number, characterIds: string[]) => void
  setPendingRaiderIO: (id: string, pending: boolean) => void
  setPendingWCL: (id: string, pending: boolean) => void
}

export const useRosterStore = create<RosterState>()(
  persist(
    (set) => ({
      addCharacter: (character) =>
        set((state) => {
          const exists = state.characters.some((c) => c.id === character.id)
          if (exists) return state
          return { characters: [...state.characters, character] }
        }),

      assignToParty: (id, partyNumber) =>
        set((state) => {
          const prevParty = state.partyAssignments[id]
          const prevOrder = { ...state.partyOrder }

          // 이전 파티에서 제거
          if (prevParty !== undefined) {
            prevOrder[prevParty] = (prevOrder[prevParty] ?? []).filter((cid) => cid !== id)
          }

          // 새 파티에 추가 (중복 방지)
          const nextPartyOrder = prevOrder[partyNumber] ?? []
          if (!nextPartyOrder.includes(id)) {
            prevOrder[partyNumber] = [...nextPartyOrder, id]
          }

          return {
            partyAssignments: { ...state.partyAssignments, [id]: partyNumber },
            partyOrder: prevOrder,
          }
        }),

      characters: [],

      clearPartyAssignments: () => set({ partyAssignments: {}, partyOrder: {} }),

      clearRoster: () => set({ characters: [], partyAssignments: {}, partyOrder: {} }),

      partyAssignments: {},

      partyOrder: {},

      pendingRaiderIOIds: new Set(),

      pendingWCLIds: new Set(),

      removeCharacter: (id) =>
        set((state) => {
          const pendingRaiderIOIds = new Set(state.pendingRaiderIOIds)
          const pendingWCLIds = new Set(state.pendingWCLIds)
          pendingRaiderIOIds.delete(id)
          pendingWCLIds.delete(id)

          const partyAssignments = { ...state.partyAssignments }
          const partyNumber = partyAssignments[id]
          delete partyAssignments[id]

          const partyOrder = { ...state.partyOrder }
          if (partyNumber !== undefined) {
            partyOrder[partyNumber] = (partyOrder[partyNumber] ?? []).filter((cid) => cid !== id)
          }

          return {
            characters: state.characters.filter((c) => c.id !== id),
            partyAssignments,
            partyOrder,
            pendingRaiderIOIds,
            pendingWCLIds,
          }
        }),

      reorderParty: (partyNumber, characterIds) =>
        set((state) => ({
          partyOrder: { ...state.partyOrder, [partyNumber]: characterIds },
        })),

      // autoAssignParties 결과로 전체 일괄 설정 시 order도 함께 재구성
      setPartyAssignments: (assignments) =>
        set(() => {
          const order: Record<number, string[]> = {}
          for (const [id, partyNumber] of Object.entries(assignments)) {
            const party = partyNumber
            if (!order[party]) order[party] = []
            order[party].push(id)
          }
          return { partyAssignments: assignments, partyOrder: order }
        }),

      setPendingRaiderIO: (id, pending) =>
        set((state) => {
          const pendingRaiderIOIds = new Set(state.pendingRaiderIOIds)
          if (pending) pendingRaiderIOIds.add(id)
          else pendingRaiderIOIds.delete(id)
          return { pendingRaiderIOIds }
        }),

      setPendingWCL: (id, pending) =>
        set((state) => {
          const pendingWCLIds = new Set(state.pendingWCLIds)
          if (pending) pendingWCLIds.add(id)
          else pendingWCLIds.delete(id)
          return { pendingWCLIds }
        }),

      unassignFromParty: (id) =>
        set((state) => {
          const partyAssignments = { ...state.partyAssignments }
          const partyNumber = partyAssignments[id]
          delete partyAssignments[id]

          const partyOrder = { ...state.partyOrder }
          if (partyNumber !== undefined) {
            partyOrder[partyNumber] = (partyOrder[partyNumber] ?? []).filter((cid) => cid !== id)
          }

          return { partyAssignments, partyOrder }
        }),

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
    }),
    {
      name: "wow-raid-roster",
      partialize: (state) => ({ characters: state.characters }),
      // 서버와 클라이언트 첫 렌더를 characters=[] 로 일치시켜 hydration 불일치 방지
      // rehydrate()는 RosterInitializer에서 mount 후 수동 호출
      skipHydration: true,
    }
  )
)
