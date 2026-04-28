import { NextResponse } from "next/server"

import { type RosterCharacter } from "@/entities/character"
import { SPEC_ROLE_MAP } from "@/entities/character/config/spec-role"
import { toRealmSlug } from "@/shared/config/realms"
import { handleRouteError } from "@/shared/lib/api-error"
import { blizzardFetch } from "@/shared/lib/blizzard-fetch"
import { type BlizzardCharacterSummary } from "@/shared/types/blizzard"

interface Params {
  name: string
  realm: string
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
      faction: summary.faction.type.toLowerCase() as "alliance" | "horde",
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
