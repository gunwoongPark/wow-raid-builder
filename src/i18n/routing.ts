import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  defaultLocale: "ko",
  localePrefix: "as-needed",
  locales: ["ko", "en"],
})
