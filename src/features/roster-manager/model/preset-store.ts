import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type RosterCharacter } from "@/entities/character"

export interface RosterPreset {
  characters: RosterCharacter[]
  createdAt: number
  id: string
  name: string
  partyAssignments: Record<string, number>
}

interface PresetState {
  presets: RosterPreset[]
  deletePreset: (id: string) => void
  savePreset: (
    name: string,
    characters: RosterCharacter[],
    partyAssignments: Record<string, number>
  ) => void
}

export const usePresetStore = create<PresetState>()(
  persist(
    (set) => ({
      deletePreset: (id) =>
        set((state) => ({ presets: state.presets.filter((preset) => preset.id !== id) })),

      presets: [],

      savePreset: (name, characters, partyAssignments) =>
        set((state) => ({
          presets: [
            ...state.presets,
            {
              characters,
              createdAt: Date.now(),
              id: Date.now().toString(36) + Math.random().toString(36).slice(2),
              name,
              partyAssignments,
            },
          ],
        })),
    }),
    { name: "wow-raid-presets" }
  )
)
