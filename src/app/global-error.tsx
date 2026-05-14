"use client"

import { useEffect } from "react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="ko">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-[#e8c96a]">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <h1 className="text-3xl font-bold tracking-widest">Raid Scope</h1>
          <p className="max-w-sm text-sm text-slate-400">
            치명적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-slate-600">오류 코드: {error.digest}</p>
          )}
          <button
            className="rounded border border-[#c9a84c]/40 px-6 py-2 text-sm text-[#c9a84c] transition-colors hover:bg-[#c9a84c]/10"
            onClick={reset}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}

export default GlobalError
