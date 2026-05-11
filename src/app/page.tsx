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
// FSD index.ts를 통하지 않는 직접 경로 — server-only 함수이므로 의도적
import { fetchCharacterOnServer } from "@/features/roster-manager/lib/fetch-character-server"
import { SITE_URL } from "@/shared/config/site"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  applicationCategory: "GameApplication",
  audience: {
    "@type": "Audience",
    audienceType: "World of Warcraft raid leaders, 월드 오브 워크래프트 공대장",
  },
  browserRequirements: "Requires JavaScript",
  description:
    "WoW Raid Builder — World of Warcraft raid composition tool for raid leaders. Analyze buff and utility coverage, build party frames (5-player groups), and share your roster. Supports Raider.IO M+ scores and Warcraft Logs integration. Midnight Season 1.",
  featureList: [
    "Character search and roster management",
    "Party frame builder (5-player groups)",
    "Drag and drop party rearrangement",
    "Buff and utility coverage visualization",
    "Synergy, external cooldown, and symbiosis recommendations",
    "Raider.IO M+ score integration",
    "Warcraft Logs raid log integration",
    "Roster URL sharing",
    "Roster preset save and load",
  ],
  inLanguage: ["en", "ko-KR"],
  keywords:
    "wow raid builder, world of warcraft raid builder, WoW raid composition, raid buff coverage, utility coverage, wow raid tool, WoW Midnight Season 1, 공격대 편성, 버프 커버리지, 레이드 빌더",
  name: "WoW Raid Builder",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  operatingSystem: "Any",
  url: SITE_URL,
}

interface PageProps {
  searchParams: Promise<{ r?: string }>
}

const HomePage = async ({ searchParams }: PageProps) => {
  const { r } = await searchParams
  const entries = decodeRosterParam(r ?? null)

  // ?r= 파라미터가 있으면 서버에서 병렬 fetch — 클라이언트 API 호출 불필요
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
      {/* 서버에서 fetch한 캐릭터를 Zustand 스토어에 주입 */}
      <RosterInitializer characters={initialCharacters} entries={entries} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        <header className="flex flex-col gap-3 pb-6">
          <div className="flex items-end justify-between gap-4">
            <h1 className="fantasy text-primary text-4xl font-bold tracking-wide">
              WoW Raid Builder
            </h1>
            <span className="text-muted-foreground/70 dark:text-primary/60 mb-1 hidden shrink-0 text-[10px] font-semibold tracking-widest uppercase sm:block">
              한밤 시즌 1
            </span>
          </div>
          <div className="wow-header-divider" />
          <p className="text-muted-foreground text-sm">
            캐릭터를 검색해 공격대를 구성하고, 파티 프레임으로 5인 파티를 편성하며 버프 커버리지를
            확인하세요.{" "}
            <span className="sr-only">
              WoW Raid Builder is a World of Warcraft raid composition tool. Analyze buff and
              utility coverage, build party frames, and share your roster URL with your raid team.
            </span>
          </p>
        </header>

        <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
          <h2 className="wow-section-title text-primary/80 mb-4">캐릭터 추가</h2>
          <CharacterSearchForm />
        </section>

        <Suspense
          fallback={
            <section className="wow-panel border-border/60 bg-card/90 min-w-0 rounded-lg border p-5">
              <p className="text-muted-foreground py-4 text-center text-sm">불러오는 중…</p>
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
