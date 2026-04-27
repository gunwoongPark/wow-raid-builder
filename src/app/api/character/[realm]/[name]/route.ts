import { NextResponse } from "next/server"

import { type Role, type RosterCharacter } from "@/entities/character"
import { toRealmSlug } from "@/shared/config/realms"
import { handleRouteError } from "@/shared/lib/api-error"
import { blizzardFetch } from "@/shared/lib/blizzard-fetch"
import { type BlizzardCharacterSummary } from "@/shared/types/blizzard"

interface Params {
  name: string
  realm: string
}

const SPEC_ROLE_MAP: Record<number, Role> = {
  // Death Knight
  250: "TANK",
  251: "MELEE",
  252: "MELEE",
  // Demon Hunter
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

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  try {
    const { name, realm } = await params
    const realmSlug = toRealmSlug(realm)

    const summary = await blizzardFetch<BlizzardCharacterSummary>(
      `/profile/wow/character/${encodeURIComponent(realmSlug)}/${encodeURIComponent(name.toLowerCase())}`,
      { namespace: "profile" }
    )

    const specId = summary.active_spec.id

    const character: RosterCharacter = {
      classId: summary.character_class.id,
      className: summary.character_class.name,
      id: `${realmSlug}-${name.toLowerCase()}`,
      itemLevel: summary.equipped_item_level,
      name: summary.name,
      raiderIO: null,
      realm: summary.realm.name,
      role: SPEC_ROLE_MAP[specId] ?? "MELEE",
      specId,
      specName: summary.active_spec.name,
      warcraftLogs: null,
    }

    return NextResponse.json(character)
  } catch (error) {
    return handleRouteError(error)
  }
}
