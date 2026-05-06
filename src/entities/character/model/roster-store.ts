import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type RosterCharacter } from "../types"

export const MAX_ROSTER_SIZE = 30

interface RosterState {
  characters: RosterCharacter[]
  partyAssignments: Record<string, number>
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
        set((state) => ({
          partyAssignments: { ...state.partyAssignments, [id]: partyNumber },
        })),

      characters: [],

      clearPartyAssignments: () => set({ partyAssignments: {} }),

      clearRoster: () => set({ characters: [], partyAssignments: {} }),

      partyAssignments: {},

      pendingRaiderIOIds: new Set(),

      pendingWCLIds: new Set(),

      removeCharacter: (id) =>
        set((state) => {
          const pendingRaiderIOIds = new Set(state.pendingRaiderIOIds)
          const pendingWCLIds = new Set(state.pendingWCLIds)
          pendingRaiderIOIds.delete(id)
          pendingWCLIds.delete(id)
          const partyAssignments = { ...state.partyAssignments }
          delete partyAssignments[id]
          return {
            characters: state.characters.filter((c) => c.id !== id),
            partyAssignments,
            pendingRaiderIOIds,
            pendingWCLIds,
          }
        }),

      setPartyAssignments: (assignments) => set({ partyAssignments: assignments }),

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
          delete partyAssignments[id]
          return { partyAssignments }
        }),

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
    }),
    {
      name: "wow-raid-roster",
      partialize: (state) => ({
        characters: state.characters,
        partyAssignments: state.partyAssignments,
      }),
    }
  )
)
