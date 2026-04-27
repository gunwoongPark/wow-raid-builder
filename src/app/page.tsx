import { CharacterSearchForm } from "@/features/character-search"
import { BuffAnalysis, RosterList } from "@/features/roster-manager"

const HomePage = () => {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">WoW Raid Builder</h1>
        <p className="mt-1 text-sm text-gray-500">
          캐릭터를 추가해 공대 구성과 버프 커버리지를 확인하세요.
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-700">캐릭터 추가</h2>
        <CharacterSearchForm />
      </section>

      <section>
        <RosterList />
      </section>

      <section>
        <BuffAnalysis />
      </section>
    </main>
  )
}

export default HomePage
