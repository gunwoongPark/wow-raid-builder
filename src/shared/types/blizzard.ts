// ─── 공통 ────────────────────────────────────────────────────────────────────

export interface BlizzardLink {
  href: string
}

export interface BlizzardLinked {
  key: BlizzardLink
  id: number
  name: string
}

export interface BlizzardKeyValue {
  key: BlizzardLink
  name: string
  id: number
}

// ─── OAuth ───────────────────────────────────────────────────────────────────

export interface BlizzardTokenResponse {
  access_token: string
  expires_in: number
  sub: string
  token_type: string
}

// ─── 에러 ─────────────────────────────────────────────────────────────────────
// 공식 문서: https://develop.battle.net/documentation/guides/using-oauth

export interface BlizzardErrorResponse {
  code: number
  detail: string
  type: string
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

// ─── Character Equipment ──────────────────────────────────────────────────────
// GET /profile/wow/character/{realmSlug}/{characterName}/equipment

export interface BlizzardEquippedItem {
  enchantments?: Array<{
    display_string: string
    enchantment_id: number
    source_item?: BlizzardKeyValue
  }>
  gems?: Array<{ item: BlizzardKeyValue; socket_index: number }>
  item: { id: number; key: BlizzardLink }
  item_subclass: BlizzardKeyValue
  level: { display_string: string; value: number }
  name: string
  quality: { name: string; type: string }
  slot: { name: string; type: string }
}

export interface BlizzardCharacterEquipment {
  character: BlizzardLink
  equipped_item_sets?: unknown[]
  equipped_items: BlizzardEquippedItem[]
}

// ─── Guild Roster ─────────────────────────────────────────────────────────────
// GET /data/wow/guild/{realmSlug}/{guildSlug}/roster

export interface BlizzardGuildMemberCharacter {
  id: number
  level: number
  name: string
  playable_class: BlizzardKeyValue
  playable_race: BlizzardKeyValue
  realm: { id: number; name: string; slug: string }
}

export interface BlizzardGuildMember {
  character: BlizzardGuildMemberCharacter
  rank: number
}

export interface BlizzardGuildRoster {
  clan_tag?: string
  faction: { name: string; type: string }
  guild: { id: number; key: BlizzardLink; name: string; realm: BlizzardKeyValue }
  members: BlizzardGuildMember[]
}
