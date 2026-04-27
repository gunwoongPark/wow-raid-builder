import axios from "axios"

import { env } from "@/shared/config/env"
import { type BlizzardTokenResponse } from "@/shared/types/blizzard"

// 토큰 요청 전용 인스턴스 — blizzardClient interceptor 재귀 호출 방지
const oauthClient = axios.create({
  baseURL: `https://${env.blizzard.region}.battle.net`,
})

let cachedToken: string | null = null
let tokenExpiresAt = 0
let inflightRequest: Promise<string> | null = null

export const invalidateToken = () => {
  cachedToken = null
  tokenExpiresAt = 0
}

const fetchFreshToken = async (): Promise<string> => {
  const { clientId, clientSecret } = env.blizzard
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const { data } = await oauthClient.post<BlizzardTokenResponse>(
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
  // 만료 60초 전에 갱신해 엣지 케이스 방지
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000

  return data.access_token
}

export const getBlizzardToken = (): Promise<string> => {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return Promise.resolve(cachedToken)
  }

  // 동시 다발 요청이 있을 때 토큰 요청이 중복 발생하지 않도록 인플라이트 공유
  if (!inflightRequest) {
    inflightRequest = fetchFreshToken().finally(() => {
      inflightRequest = null
    })
  }

  return inflightRequest
}
