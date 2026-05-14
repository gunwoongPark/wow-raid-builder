"use client"

import { useLocale, useTranslations } from "next-intl"

import { usePathname } from "@/i18n/navigation"

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("language")

  const handleToggle = () => {
    const nextLocale = locale === "ko" ? "en" : "ko"
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`
    // 소프트 내비게이션은 미들웨어를 거치지 않아 쿠키 반영이 불안정함
    // 하드 내비게이션으로 미들웨어가 새 쿠키를 읽도록 보장
    const nextPath = nextLocale === "en" ? `/en${pathname === "/" ? "" : pathname}` : pathname
    window.location.href = nextPath || "/"
  }

  return (
    <button
      aria-label={`Switch to ${t("switchTo")}`}
      className="border-border/60 bg-card/90 text-muted-foreground hover:border-primary/40 hover:text-primary fixed right-16 bottom-4 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full border text-[11px] font-semibold shadow-sm backdrop-blur-sm transition-all"
      onClick={handleToggle}
      title={t("switchTo")}
    >
      {t("switchTo")}
    </button>
  )
}
