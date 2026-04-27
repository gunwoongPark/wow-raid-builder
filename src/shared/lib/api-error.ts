import axios from "axios"
import { NextResponse } from "next/server"

export interface ApiErrorResponse {
  error: string
  status: number
}

export const handleRouteError = (error: unknown): NextResponse<ApiErrorResponse> => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500
    // 외부 API 에러 메시지를 그대로 노출
    const raw = error.response?.data
    const message = raw?.detail ?? raw?.message ?? raw?.error ?? error.message ?? "Unknown error"

    return NextResponse.json({ error: String(message), status }, { status })
  }

  const message = error instanceof Error ? error.message : "Internal server error"
  return NextResponse.json({ error: message, status: 500 }, { status: 500 })
}
