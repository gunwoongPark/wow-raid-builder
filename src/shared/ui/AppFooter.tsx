import { useTranslations } from "next-intl"

export const AppFooter = () => {
  const t = useTranslations("footer")

  return (
    <footer className="border-border/60 bg-card/70 mt-auto border-t backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 text-xs sm:px-6">
        <p className="text-muted-foreground">
          {t("dataSource")}{" "}
          <a
            className="text-primary hover:text-primary/80 underline-offset-2 hover:underline"
            href="https://develop.battle.net/"
            rel="noreferrer"
            target="_blank"
          >
            Blizzard API
          </a>
          {" · "}
          <a
            className="text-primary hover:text-primary/80 underline-offset-2 hover:underline"
            href="https://raider.io/api"
            rel="noreferrer"
            target="_blank"
          >
            Raider.IO
          </a>
          {" · "}
          <a
            className="text-primary hover:text-primary/80 underline-offset-2 hover:underline"
            href="https://www.warcraftlogs.com/api/docs"
            rel="noreferrer"
            target="_blank"
          >
            Warcraft Logs
          </a>
        </p>
      </div>
    </footer>
  )
}
