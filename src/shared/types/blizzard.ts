// ─── 공통 ────────────────────────────────────────────────────────────────────

export interface BlizzardLink {
  href: string
}

export interface BlizzardKeyValue {
  id: number
  key: BlizzardLink
  name: string
}

// ─── OAuth ───────────────────────────────────────────────────────────────────

export interface BlizzardTokenResponse {
  access_token: string
  expires_in: number
  sub: string
  token_type: string
}

// ─── Character Profile Summary ────────────────────────────────────────────────
// GET /profile/wow/character/{realmSlug}/{characterName}

export interface BlizzardCharacterSummary {
  active_spec: BlizzardKeyValue
  active_title?: { display_string: string; id: number }
  average_item_level: number
  character_class: BlizzardKeyValue
  equipped_item_level: number
  experience: number
  faction: { name: string; type: string }
  gender: { name: string; type: string }
  id: number
  level: number
  name: string
  race: BlizzardKeyValue
  realm: { id: number; name: string; slug: string }
}
