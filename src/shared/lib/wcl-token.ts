import axios from "axios"

import { env } from "@/shared/config/env"

interface WCLTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

const oauthClient = axios.create({ baseURL: "https://www.warcraftlogs.com" })

let cachedToken: string | null = null
let tokenExpiresAt = 0
let inflightRequest: Promise<string> | null = null

const fetchFreshToken = async (): Promise<string> => {
  const { clientId, clientSecret } = env.warcraftLogs
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const { data } = await oauthClient.post<WCLTokenResponse>(
    "/oauth/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )

  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return data.access_token
}

export const getWCLToken = (): Promise<string> => {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return Promise.resolve(cachedToken)
  }

  if (!inflightRequest) {
    inflightRequest = fetchFreshToken().finally(() => {
      inflightRequest = null
    })
  }

  return inflightRequest
}
