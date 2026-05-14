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
import { SITE_URL } from "@/shared/config/site"

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ r?: string }>
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  applicationCategory: "GameApplication",
  audience: {
    "@type": "Audience",
    audienceType: "World of Warcraft Raid Leader",
  },
  browserRequirements: "Requires JavaScript",
  description:
    "Free WoW raid composition tool for raid leaders. Search characters, check buff & utility coverage, and arrange 5-player parties. Built for World of Warcraft Midnight Season 1.",
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
  inLanguage: ["ko-KR", "en"],
  keywords:
    "RaidCraft, WoW, World of Warcraft, wow raid, wow raid builder, wow raid composition, raid leader, buff coverage, utility, Midnight Season 1, Raider.IO, Warcraft Logs",
  name: "RaidCraft",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Any",
  url: SITE_URL,
}

const HomePage = async ({ params, searchParams }: PageProps) => {
  const { locale } = await params
  const { r } = await searchParams
  const t = await getTranslations({ locale, namespace: "home" })

  const entries = decodeRosterParam(r ?? null)

  const results = await Promise.allSettled(
    entries.map(({ name, realmSlug }) => fetchCharacterOnServer(realmSlug, name))
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
