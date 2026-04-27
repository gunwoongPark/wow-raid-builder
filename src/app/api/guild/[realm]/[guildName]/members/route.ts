import { NextResponse } from "next/server"

import { type Guild } from "@/entities/guild"
import { blizzardFetch } from "@/shared/lib/blizzard-fetch"

interface Params {
  realm: string
  guildName: string
}

export const GET = async (_req: Request, { params }: { params: Promise<Params> }) => {
  const { guildName, realm } = await params

  const data = await blizzardFetch<Guild>(
    `/data/wow/guild/${encodeURIComponent(realm)}/${encodeURIComponent(guildName)}/roster`,
    { namespace: "profile" }
  )

  return NextResponse.json(data)
}
