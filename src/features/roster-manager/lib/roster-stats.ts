import { type RosterCharacter } from "@/entities/character"

export const countByRole = (characters: RosterCharacter[]): Record<string, number> =>
  characters.reduce<Record<string, number>>((accumulator, character) => {
    accumulator[character.role] = (accumulator[character.role] ?? 0) + 1
    return accumulator
  }, {})
