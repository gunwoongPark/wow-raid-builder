import Link from "next/link"

const NotFoundPage = () => (
  <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 p-4 pt-20 sm:p-6">
    <div className="wow-panel border-border/60 bg-card/90 w-full max-w-lg rounded-lg border p-8 text-center">
      <div className="wow-header-divider mb-6" />
      <p className="text-primary/40 mb-2 font-mono text-6xl font-bold">404</p>
      <h2 className="fantasy text-primary mb-3 text-2xl font-bold tracking-wide">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-muted-foreground mb-6 text-sm">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        className="text-primary border-primary/40 hover:bg-primary/10 inline-block rounded border px-6 py-2 text-sm transition-colors"
        href="/"
      >
        홈으로 돌아가기
      </Link>
      <p className="text-muted-foreground mt-5 text-xs">
        Created by{" "}
        <Link
          className="text-primary hover:text-primary/80 underline-offset-2 hover:underline"
          href="https://github.com/gunwoongPark"
          rel="noreferrer"
          target="_blank"
        >
          @gunwoongPark
        </Link>
      </p>
      <div className="wow-header-divider mt-6" />
    </div>
  </main>
)

export default NotFoundPage
