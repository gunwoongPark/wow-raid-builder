import { Suspense } from "react"

import { CharacterSearchForm } from "@/features/character-search"
import {
  BuffAnalysis,
  BuffRecommendations,
  PresetManager,
  RosterList,
  RosterUrlLoader,
} from "@/features/roster-manager"
import { SITE_URL } from "@/shared/config/site"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  applicationCategory: "GameApplication",
  audience: {
    "@type": "Audience",
    audienceType: "월드 오브 워크래프트 공대장, 레이드 리더",
  },
  browserRequirements: "JavaScript 필요",
  description:
    "공대장을 위한 월드 오브 워크래프트 공격대 구성 분석 도구. 캐릭터 검색, 버프·유틸 커버리지 분석, 파티 프레임 기반 5인 파티 편성을 지원합니다. 한밤(Midnight) 시즌 1 기준.",
  featureList: [
    "캐릭터 검색 및 공격대원 추가",
    "파티 프레임 기반 5인 파티 편성",
    "파티 간 드래그 앤 드롭 재배치",
    "버프·유틸리티 커버리지 시각화",
    "시너지·외생기·공생기 추천",
    "Raider.IO M+ 점수 연동",
    "Warcraft Logs 레이드 로그 연동",
    "공격대 URL 공유",
    "로스터 프리셋 저장/불러오기",
  ],
  inLanguage: "ko-KR",
  keywords:
    "WoW, 공격대, 레이드, 버프, 유틸, 한밤, Midnight, 공대장, 레이드 빌더, 공격대 편성, 파티 프레임, 파티 편성, 5인 파티, 드래그 앤 드롭",
  name: "WoW Raid Builder",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  operatingSystem: "Any",
  url: SITE_URL,
}

const HomePage = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        {/* ?r= 파라미터로 공유된 로스터를 자동 로드 — useSearchParams는 Suspense 필요 */}
        <Suspense fallback={null}>
          <RosterUrlLoader />
        </Suspense>

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
            확인하세요.
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
