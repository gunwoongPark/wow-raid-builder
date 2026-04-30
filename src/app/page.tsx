import { Suspense } from "react"

import { CharacterSearchForm } from "@/features/character-search"
import {
  BuffAnalysis,
  BuffRecommendations,
  PresetManager,
  RosterList,
  RosterUrlLoader,
} from "@/features/roster-manager"

const HomePage = () => {
  return (
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
          <span className="text-muted-foreground/50 mb-1 hidden shrink-0 text-[10px] font-semibold tracking-widest uppercase sm:block">
            한밤 시즌 1
          </span>
        </div>
        <div className="wow-header-divider" />
        <p className="text-muted-foreground text-sm">
          캐릭터를 검색해 공격대를 구성하고 버프 커버리지를 확인하세요.
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
  )
}

export default HomePage
