import axios from "axios"

// 클라이언트 → Next.js Route Handler 프록시용
export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
})
