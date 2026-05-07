import { NextResponse } from "next/server"

import { type RosterCharacter, SPEC_ROLE_MAP } from "@/entities/character"
import { CACHE_HEADERS } from "@/shared/config/cache-headers"
import { toRealmSlug } from "@/shared/config/realms"
import { handleRouteError } from "@/shared/lib/api-error"
import { blizzardFetch } from "@/shared/lib/blizzard-fetch"
import { characterParamSchema } from "@/shared/lib/route-param-schema"
import { type BlizzardCharacterSummary } from "@/shared/types/blizzard"

interface Params {
  name: string
  realm: string
}

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  try {
    const raw = await params
    const parsed = characterParamSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: "잘못된 요청입니다.", status: 400 }, { status: 400 })
    }
    const { name, realm } = parsed.data
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

    return NextResponse.json(character, {
      headers: { "Cache-Control": CACHE_HEADERS.CHARACTER_SUMMARY },
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
