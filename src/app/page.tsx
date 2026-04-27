import { CharacterSearchForm } from "@/features/character-search"
import { BuffAnalysis, RosterList } from "@/features/roster-manager"

const Section = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <section className="border-border/40 bg-card/40 rounded-lg border p-5">
    {title && (
      <h2 className="fantasy text-primary/80 mb-4 text-sm font-semibold tracking-widest uppercase">
        {title}
      </h2>
    )}
    {children}
  </section>
)

const HomePage = () => {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="border-border/30 flex flex-col gap-1 border-b pb-6">
        <h1 className="fantasy text-primary text-3xl font-bold">WoW Raid Builder</h1>
        <p className="text-muted-foreground text-sm">
          캐릭터를 검색해 공격대를 구성하고 버프 커버리지를 확인하세요.
        </p>
      </div>

      <div className="border-border/40 bg-card/40 rounded-lg border p-5">
        <h2 className="fantasy text-primary/80 mb-4 text-sm font-semibold tracking-widest uppercase">
          캐릭터 추가
        </h2>
        <CharacterSearchForm />
      </div>

      <Section>
        <RosterList />
      </Section>

      <Section>
        <BuffAnalysis />
      </Section>
    </main>
  )
}

export default HomePage
