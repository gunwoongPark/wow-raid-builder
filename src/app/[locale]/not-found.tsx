import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

const NotFoundPage = () => {
  const t = useTranslations("notFound")

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 p-4 pt-20 sm:p-6">
      <div className="wow-panel border-border/60 bg-card/90 w-full max-w-lg rounded-lg border p-8 text-center">
        <div className="wow-header-divider mb-6" />
        <p className="text-primary/40 mb-2 font-mono text-6xl font-bold">404</p>
        <h2 className="fantasy text-primary mb-3 text-2xl font-bold tracking-wide">{t("title")}</h2>
        <p className="text-muted-foreground mb-6 text-sm">{t("description")}</p>
        <Link
          className="text-primary border-primary/40 hover:bg-primary/10 inline-block rounded border px-6 py-2 text-sm transition-colors"
          href="/"
        >
          {t("backHome")}
        </Link>
        <p className="text-muted-foreground mt-5 text-xs">
          {t("createdBy")}{" "}
          <a
            className="text-primary hover:text-primary/80 underline-offset-2 hover:underline"
            href="https://github.com/gunwoongPark"
            rel="noreferrer"
            target="_blank"
          >
            @gunwoongPark
          </a>
        </p>
        <div className="wow-header-divider mt-6" />
      </div>
    </main>
  )
}

export default NotFoundPage
