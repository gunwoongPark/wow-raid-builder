"use client"

import { useEffect, useState } from "react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

type Locale = "ko" | "en"

const MESSAGES = {
  en: {
    description: "A critical error occurred. Please refresh the page.",
    errorCode: "Error code:",
    lang: "en",
    retry: "Try again",
  },
  ko: {
    description: "치명적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.",
    errorCode: "오류 코드:",
    lang: "ko",
    retry: "다시 시도",
  },
}

const detectLocale = (): Locale => {
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)
  if (match?.[1] === "en") return "en"
  if (match?.[1] === "ko") return "ko"
  return navigator.language.startsWith("ko") ? "ko" : "en"
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  const [locale] = useState<Locale>(() => (typeof document === "undefined" ? "ko" : detectLocale()))

  useEffect(() => {
    console.error(error)
  }, [error])

  const m = MESSAGES[locale]

  return (
    <html lang={m.lang}>
      <body className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-[#e8c96a]">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <h1 className="text-3xl font-bold tracking-widest">Raid Scope</h1>
          <p className="max-w-sm text-sm text-slate-400">{m.description}</p>
          {error.digest && (
            <p className="font-mono text-xs text-slate-600">
              {m.errorCode} {error.digest}
            </p>
          )}
          <button
            className="rounded border border-[#c9a84c]/40 px-6 py-2 text-sm text-[#c9a84c] transition-colors hover:bg-[#c9a84c]/10"
            onClick={reset}
          >
            {m.retry}
          </button>
        </div>
      </body>
    </html>
  )
}

export default GlobalError
