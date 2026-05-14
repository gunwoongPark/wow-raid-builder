import { env } from "@/shared/config/env"
import { type GameRegion, REGION_CONFIG } from "@/shared/config/region"

import { createTokenCache } from "./create-token-cache"

const getCredentials = () => ({
  clientId: env.blizzard.clientId,
  clientSecret: env.blizzard.clientSecret,
})

const tokenCaches = {
  kr: createTokenCache({ baseURL: REGION_CONFIG.kr.oauthBaseUrl, getCredentials }),
  us: createTokenCache({ baseURL: REGION_CONFIG.us.oauthBaseUrl, getCredentials }),
} satisfies Record<GameRegion, ReturnType<typeof createTokenCache>>

export const getBlizzardToken = (region: GameRegion) => tokenCaches[region].getToken()
export const invalidateToken = (region: GameRegion) => tokenCaches[region].invalidate()
