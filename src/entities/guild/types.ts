export interface GuildMember {
  character: {
    name: string
    id: number
    realm: { slug: string; name: string }
    level: number
    playable_class: { name: string; id: number }
    playable_race: { name: string; id: number }
  }
  rank: number
}

export interface Guild {
  id: number
  name: string
  faction: { type: string; name: string }
  realm: { slug: string; name: string }
  member_count: number
  members: GuildMember[]
}
