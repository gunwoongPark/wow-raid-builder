import axios from "axios"

interface TokenResponse {
  access_token: string
  expires_in: number
}

interface TokenCacheOptions {
  baseURL: string
  getCredentials: () => { clientId: string; clientSecret: string }
  tokenPath?: string
}

export const createTokenCache = ({
  baseURL,
  getCredentials,
  tokenPath = "/oauth/token",
}: TokenCacheOptions) => {
  const oauthClient = axios.create({ baseURL })

  let cachedToken: string | null = null
  let tokenExpiresAt = 0
  let inflightRequest: Promise<string> | null = null

  const fetchFreshToken = async (): Promise<string> => {
    const { clientId, clientSecret } = getCredentials()
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

    const { data } = await oauthClient.post<TokenResponse>(
      tokenPath,
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

  const getToken = (): Promise<string> => {
    if (cachedToken && Date.now() < tokenExpiresAt) {
      return Promise.resolve(cachedToken)
    }

    inflightRequest ??= fetchFreshToken().finally(() => {
      inflightRequest = null
    })

    return inflightRequest
  }

  const invalidate = () => {
    cachedToken = null
    tokenExpiresAt = 0
  }

  return { getToken, invalidate }
}
