import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type RosterCharacter } from "../types"

export const MAX_ROSTER_SIZE = 30

interface RosterState {
  characters: RosterCharacter[]
  pendingRaiderIOIds: Set<string>
  pendingWCLIds: Set<string>
  addCharacter: (character: RosterCharacter) => void
  removeCharacter: (id: string) => void
  updateCharacter: (id: string, updates: Partial<RosterCharacter>) => void
  clearRoster: () => void
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

      characters: [],

      clearRoster: () => set({ characters: [] }),

      pendingRaiderIOIds: new Set(),

      pendingWCLIds: new Set(),

      removeCharacter: (id) =>
        set((state) => {
          const pendingRaiderIOIds = new Set(state.pendingRaiderIOIds)
          const pendingWCLIds = new Set(state.pendingWCLIds)
          pendingRaiderIOIds.delete(id)
          pendingWCLIds.delete(id)
          return {
            characters: state.characters.filter((c) => c.id !== id),
            pendingRaiderIOIds,
            pendingWCLIds,
          }
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

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
    }),
    {
      name: "wow-raid-roster",
      partialize: (state) => ({ characters: state.characters }),
    }
  )
)
