"use client"

import { useLocale, useTranslations } from "next-intl"

import { usePathname, useRouter } from "@/i18n/navigation"

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("language")

  const handleToggle = () => {
    const nextLocale = locale === "ko" ? "en" : "ko"
    document.cookie = `NEXT_LOCALE=${nextLocale};max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`
    router.replace(pathname, { locale: nextLocale })
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
