import { type Role } from "../types"

/** Blizzard 특성화(spec) ID → 공대 역할 매핑 */
export const SPEC_ROLE_MAP: Record<number, Role> = {
  // Death Knight
  250: "TANK",
  251: "MELEE",
  252: "MELEE",
  // Demon Hunter
  1480: "RANGED", // 포식 (Midnight 신규 스펙)
  577: "MELEE",
  581: "TANK",
  // Druid
  102: "RANGED",
  103: "MELEE",
  104: "TANK",
  105: "HEALER",
  // Evoker
  1467: "RANGED",
  1468: "HEALER",
  1473: "RANGED",
  // Hunter
  253: "RANGED",
  254: "RANGED",
  255: "MELEE",
  // Mage
  62: "RANGED",
  63: "RANGED",
  64: "RANGED",
  // Monk
  268: "TANK",
  269: "MELEE",
  270: "HEALER",
  // Paladin
  65: "HEALER",
  66: "TANK",
  70: "MELEE",
  // Priest
  256: "HEALER",
  257: "HEALER",
  258: "RANGED",
  // Rogue
  259: "MELEE",
  260: "MELEE",
  261: "MELEE",
  // Shaman
  262: "MELEE",
  263: "RANGED",
  264: "HEALER",
  // Warlock
  265: "RANGED",
  266: "RANGED",
  267: "RANGED",
  // Warrior
  71: "MELEE",
  72: "MELEE",
  73: "TANK",
}
