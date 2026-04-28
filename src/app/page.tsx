import { Suspense } from "react"

import { CharacterSearchForm } from "@/features/character-search"
import { BuffAnalysis, RosterList, RosterUrlLoader } from "@/features/roster-manager"

const HomePage = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl min-w-[960px] flex-col gap-6 p-6">
      {/* ?r= 파라미터로 공유된 로스터를 자동 로드 — useSearchParams는 Suspense 필요 */}
      <Suspense fallback={null}>
        <RosterUrlLoader />
      </Suspense>

      <div className="border-primary/40 flex flex-col gap-1 border-b pb-6">
        <h1 className="fantasy text-primary text-3xl font-bold">WoW Raid Builder</h1>
        <p className="text-muted-foreground text-sm">
          캐릭터를 검색해 공격대를 구성하고 버프 커버리지를 확인하세요.
        </p>
      </div>

      <section className="wow-panel border-border/60 bg-card/90 rounded-lg border p-5">
        <h2 className="fantasy text-primary/90 mb-4 text-sm font-semibold tracking-widest uppercase">
          캐릭터 추가
        </h2>
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

      <BuffAnalysis />
    </main>
  )
}

export default HomePage
