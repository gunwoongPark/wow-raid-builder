import { env } from "@/shared/config/env"

import { createTokenCache } from "./create-token-cache"

const { getToken, invalidate } = createTokenCache({
  baseURL: `https://${env.blizzard.region}.battle.net`,
  getCredentials: () => ({
    clientId: env.blizzard.clientId,
    clientSecret: env.blizzard.clientSecret,
  }),
})

export const getBlizzardToken = getToken
export const invalidateToken = invalidate
