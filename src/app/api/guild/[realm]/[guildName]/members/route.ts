import { NextResponse } from "next/server"

import { toRealmSlug } from "@/shared/config/realms"
import { handleRouteError } from "@/shared/lib/api-error"
import { blizzardFetch } from "@/shared/lib/blizzard-fetch"
import { type BlizzardGuildRoster } from "@/shared/types/blizzard"

interface Params {
  guildName: string
  realm: string
}

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  try {
    const { guildName, realm } = await params
    const realmSlug = toRealmSlug(realm)

    const data = await blizzardFetch<BlizzardGuildRoster>(
      `/data/wow/guild/${encodeURIComponent(realmSlug)}/${encodeURIComponent(guildName.toLowerCase())}/roster`,
      { namespace: "profile" }
    )

    return NextResponse.json(data)
  } catch (error) {
    return handleRouteError(error)
  }
}
