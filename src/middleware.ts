import createNextIntlMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"

import { routing } from "@/i18n/routing"

const nextIntlMiddleware = createNextIntlMiddleware(routing)

const LOCALE_COOKIE = "NEXT_LOCALE"

/**
 * 접속 국가에 따라 로케일을 감지한다.
 * - Vercel 배포: x-vercel-ip-country 헤더 사용 (KR → ko, 그 외 → en)
 * - 로컬 개발: Accept-Language 헤더 폴백
 */
const detectLocale = (request: NextRequest): "ko" | "en" => {
  const country = request.headers.get("x-vercel-ip-country")
  if (country) return country === "KR" ? "ko" : "en"

  const acceptLanguage = request.headers.get("accept-language") ?? ""
  return acceptLanguage.toLowerCase().startsWith("ko") ? "ko" : "en"
}

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // API 라우트는 로케일 처리 불필요
  if (pathname.startsWith("/api")) return NextResponse.next()

  // 이미 로케일 쿠키가 있으면 next-intl에 위임
  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (localeCookie === "ko" || localeCookie === "en") {
    return nextIntlMiddleware(request)
  }

  // 첫 방문: 국가 기반 로케일 감지 후 쿠키 설정
  const detectedLocale = detectLocale(request)

  if (detectedLocale === "en" && !pathname.startsWith("/en")) {
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname === "/" ? "" : pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set(LOCALE_COOKIE, "en", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    })
    return response
  }

  const response = nextIntlMiddleware(request)
  response.cookies.set(LOCALE_COOKIE, detectedLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  })
  return response
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}
