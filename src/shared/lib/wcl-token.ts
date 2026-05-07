import { env } from "@/shared/config/env"

import { createTokenCache } from "./create-token-cache"

const { getToken } = createTokenCache({
  baseURL: "https://www.warcraftlogs.com",
  getCredentials: () => ({
    clientId: env.warcraftLogs.clientId,
    clientSecret: env.warcraftLogs.clientSecret,
  }),
})

export const getWCLToken = getToken
