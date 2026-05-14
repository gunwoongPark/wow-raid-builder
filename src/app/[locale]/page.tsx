import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { decodeRosterParam } from "@/entities/character"
import { CharacterSearchForm } from "@/features/character-search"
import {
  BuffAnalysis,
  BuffRecommendations,
  PresetManager,
  RosterInitializer,
  RosterList,
} from "@/features/roster-manager"
// Direct import — server-only function, intentionally bypasses index.ts
import { fetchCharacterOnServer } from "@/features/roster-manager/lib/fetch-character-server"
import { SITE_LAST_MODIFIED, SITE_RELEASE_DATE, SITE_URL } from "@/shared/config/site"

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ r?: string }>
}

const buildJsonLd = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  applicationCategory: "GameApplication",
  audience: {
    "@type": "Audience",
    audienceType: locale === "ko" ? "월드 오브 워크래프트 공대장" : "World of Warcraft Raid Leader",
  },
  browserRequirements: "Requires JavaScript",
  dateModified: SITE_LAST_MODIFIED.toISOString().split("T")[0],
  datePublished: SITE_RELEASE_DATE.toISOString().split("T")[0],
  description:
    locale === "ko"
      ? "와우 공대장을 위한 무료 레이드 구성 분석 툴. 캐릭터 검색, 버프·유틸 커버리지 분석, 파티 프레임 편성을 한 곳에서. 한밤 시즌 1 기준."
      : "Free WoW raid composition tool for raid leaders. Search characters, check buff & utility coverage, and arrange 5-player parties. Built for World of Warcraft Midnight Season 1.",
  featureList: [
    "WoW character search and roster management",
    "Buff & utility coverage visualization",
    "Party frame — drag & drop 5-player party arrangement",
    "Synergy, external CD, and raid CD recommendations",
    "Raider.IO M+ score integration",
    "Warcraft Logs raid log percentile integration",
    "Roster URL sharing",
    "Roster preset save/load",
  ],
  image: `${SITE_URL}/opengraph-image`,
  inLanguage: locale === "ko" ? "ko-KR" : "en-US",
  keywords:
    locale === "ko"
      ? "Raid Scope, WoW, 와우, 레이드, 공대, 공격대 구성, 버프 커버리지, 한밤 시즌 1, Raider.IO, Warcraft Logs"
      : "Raid Scope, WoW, World of Warcraft, wow raid composition, raid leader, buff coverage, Midnight Season 1, Raider.IO, Warcraft Logs",
  name: "Raid Scope",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Any",
  url: locale === "ko" ? SITE_URL : `${SITE_URL}/en`,
})

const HomePage = async ({ params, searchParams }: PageProps) => {
  const { locale } = await params
  const { r } = await searchParams
  const t = await getTranslations({ locale, namespace: "home" })

  const entries = decodeRosterParam(r ?? null)

  const results = await Promise.allSettled(
    entries.map(({ name, realmSlug }) => fetchCharacterOnServer(realmSlug, name, locale))
  )
  const initialCharacters = results
    .filter(
      (
        res
      ): res is PromiseFulfilledResult<
        NonNullable<Awaited<ReturnType<typeof fetchCharacterOnServer>>>
      > => res.status === "fulfilled" && res.value !== null
    )
    .map((res) => res.value)

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale)) }}
        type="application/ld+json"
      />
      <RosterInitializer characters={initialCharacters} entries={entries} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
        <header className="flex flex-col gap-3 pb-6">
          <div className="flex items-end justify-between gap-4">
            <h1 className="fantasy text-primary text-4xl font-bold tracking-wide">{t("title")}</h1>
            <span className="text-muted-foreground/70 dark:text-primary/60 mb-1 hidden shrink-0 text-[10px] font-semibold tracking-widest uppercase sm:block">
              {t("season")}
            </span>
          </div>
          <div className="wow-header-divider" />
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </header>

        <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
          <h2 className="wow-section-title text-primary/80 mb-4">{t("characterSearch")}</h2>
          <CharacterSearchForm />
        </section>

        <Suspense
          fallback={
            <section className="wow-panel border-border/60 bg-card/90 min-w-0 rounded-lg border p-5">
              <p className="text-muted-foreground py-4 text-center text-sm">{t("loading")}</p>
            </section>
          }
        >
          <RosterList />
        </Suspense>

        <PresetManager />

        <BuffAnalysis />

        <BuffRecommendations />
      </main>
    </>
  )
}

export default HomePage
