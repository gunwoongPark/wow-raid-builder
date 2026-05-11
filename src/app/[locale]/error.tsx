"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

const ErrorPage = ({ error, unstable_retry: retry }: ErrorPageProps) => {
  const t = useTranslations("error")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 p-4 pt-20 sm:p-6">
      <div className="wow-panel border-border/60 bg-card/90 w-full max-w-lg rounded-lg border p-8 text-center">
        <div className="wow-header-divider mb-6" />
        <h2 className="fantasy text-primary mb-3 text-2xl font-bold tracking-wide">{t("title")}</h2>
        <p className="text-muted-foreground mb-6 text-sm">{t("description")}</p>
        {error.digest && (
          <p className="text-muted-foreground/50 mb-6 font-mono text-xs">
            {t("errorCode", { code: error.digest })}
          </p>
        )}
        <button
          className="text-primary border-primary/40 hover:bg-primary/10 rounded border px-6 py-2 text-sm transition-colors"
          onClick={retry}
        >
          {t("retry")}
        </button>
        <div className="wow-header-divider mt-6" />
      </div>
    </main>
  )
}

export default ErrorPage
