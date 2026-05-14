import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios"

import { type GameRegion, REGION_CONFIG } from "@/shared/config/region"
import { getBlizzardToken, invalidateToken } from "@/shared/lib/blizzard-token"

const retriedConfigs = new WeakSet<InternalAxiosRequestConfig>()
const clients = new Map<GameRegion, AxiosInstance>()

const createClient = (region: GameRegion): AxiosInstance => {
  const regionConfig = REGION_CONFIG[region]

  const client = axios.create({
    baseURL: regionConfig.apiBaseUrl,
    headers: { "Content-Type": "application/json" },
    params: { locale: regionConfig.locale },
  })

  client.interceptors.request.use(async (config) => {
    const token = await getBlizzardToken(region)
    config.headers.Authorization = `Bearer ${token}`
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error)

      const config = error.config
      if (!config) return Promise.reject(error)

      const isUnauthorized = error.response?.status === 401
      const alreadyRetried = retriedConfigs.has(config)

      if (isUnauthorized && !alreadyRetried) {
        retriedConfigs.add(config)
        invalidateToken(region)

        const freshToken = await getBlizzardToken(region)
        config.headers.Authorization = `Bearer ${freshToken}`
        return client(config)
      }

      return Promise.reject(error)
    }
  )

  return client
}

export const getBlizzardClient = (region: GameRegion): AxiosInstance => {
  const existing = clients.get(region)
  if (existing) return existing

  const client = createClient(region)
  clients.set(region, client)
  return client
}
