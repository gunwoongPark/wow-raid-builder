export interface BlizzardTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  sub: string
}

export interface BlizzardLink {
  href: string
}

export interface BlizzardLinked {
  key: BlizzardLink
  name: string
  id: number
}
