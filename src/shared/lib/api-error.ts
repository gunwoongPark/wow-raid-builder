import axios from "axios"
import { NextResponse } from "next/server"

export interface ApiErrorResponse {
  error: string
  status: number
}

export const handleRouteError = (error: unknown): NextResponse<ApiErrorResponse> => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500

    const messageMap: Record<number, string> = {
      400: "잘못된 요청입니다.",
      401: "인증에 실패했습니다.",
      403: "접근 권한이 없습니다.",
      404: "캐릭터 또는 길드를 찾을 수 없습니다.",
      429: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      500: "외부 API 서버 오류입니다.",
    }

    return NextResponse.json(
      { error: messageMap[status] ?? "알 수 없는 오류가 발생했습니다.", status },
      { status }
    )
  }

  return NextResponse.json(
    { error: "서버 내부 오류가 발생했습니다.", status: 500 },
    { status: 500 }
  )
}
