import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type RosterCharacter } from "@/entities/character"

export const MAX_ROSTER_SIZE = 30

interface RosterState {
  characters: RosterCharacter[]
  addCharacter: (character: RosterCharacter) => void
  removeCharacter: (id: string) => void
  updateCharacter: (id: string, updates: Partial<RosterCharacter>) => void
  clearRoster: () => void
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

      removeCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
        })),

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
    }),
    {
      name: "wow-raid-roster",
    }
  )
)
