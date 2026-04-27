import axios, { type InternalAxiosRequestConfig } from "axios"

import { env } from "@/shared/config/env"
import { getBlizzardToken, invalidateToken } from "@/shared/lib/blizzard-token"

// 401 재시도 추적 — config 객체 변조 없이 WeakSet으로 관리
const retriedConfigs = new WeakSet<InternalAxiosRequestConfig>()

export const blizzardClient = axios.create({
  baseURL: `https://${env.blizzard.region}.api.blizzard.com`,
  headers: { "Content-Type": "application/json" },
  params: { locale: env.blizzard.locale },
})

// ─── Request interceptor: Bearer 토큰 자동 주입 ───────────────────────────
blizzardClient.interceptors.request.use(async (config) => {
  const token = await getBlizzardToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response interceptor: 401 시 토큰 무효화 후 1회 재시도 ───────────────
blizzardClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const config = error.config
    if (!config) return Promise.reject(error)

    const isUnauthorized = error.response?.status === 401
    const alreadyRetried = retriedConfigs.has(config)

    if (isUnauthorized && !alreadyRetried) {
      retriedConfigs.add(config)
      invalidateToken()

      const freshToken = await getBlizzardToken()
      config.headers.Authorization = `Bearer ${freshToken}`
      return blizzardClient(config)
    }

    return Promise.reject(error)
  }
)
