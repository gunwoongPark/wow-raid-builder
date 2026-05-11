import { type BuffCategory } from "@/entities/character"

// Bloodlust and Battle Rez are displayed side-by-side in one row
export const INLINE_CATEGORIES = new Set<BuffCategory>(["bloodlust", "battleRez"])
