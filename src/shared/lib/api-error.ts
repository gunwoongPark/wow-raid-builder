import axios from "axios"
import { NextResponse } from "next/server"

export interface ApiErrorResponse {
  error: string
  status: number
}

const safeMessage = (status: number): string => {
  if (status === 404) return "캐릭터를 찾을 수 없습니다."
  if (status === 429) return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
  if (status >= 500) return "외부 서비스에 일시적인 문제가 발생했습니다."
  return "데이터를 불러올 수 없습니다."
}

export const handleRouteError = (error: unknown): NextResponse<ApiErrorResponse> => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500
    return NextResponse.json({ error: safeMessage(status), status }, { status })
  }

  return NextResponse.json({ error: "서버 오류가 발생했습니다.", status: 500 }, { status: 500 })
}
