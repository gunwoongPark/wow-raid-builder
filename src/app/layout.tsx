import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { Cinzel, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { SITE_URL } from "@/shared/config/site"
import { QueryProvider } from "@/shared/lib/query-provider"
import { AppThemeProvider } from "@/shared/lib/theme-provider"
import { AppFooter } from "@/shared/ui/AppFooter"
import { AppToaster } from "@/shared/ui/AppToaster"
import { NetworkStatusMonitor } from "@/shared/ui/NetworkStatusMonitor"
import { ThemeToggle } from "@/shared/ui/ThemeToggle"

import "./globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
})

const pretendard = localFont({
  display: "swap",
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
})

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: { "ko-KR": SITE_URL },
  },
  applicationName: "WoW Raid Builder",
  authors: [{ name: "gunwoongPark", url: "https://github.com/gunwoongPark" }],
  category: "game",
  creator: "gunwoongPark",
  description:
    "WoW Raid Builder — World of Warcraft raid composition tool for raid leaders. Analyze buff & utility coverage, build party frames, and share your roster. 공격대 버프·유틸 커버리지 분석 및 파티 편성 도구. 한밤(Midnight) 시즌 1 기준.",
  keywords: [
    "WoW",
    "World of Warcraft",
    "월드 오브 워크래프트",
    "공격대",
    "공대",
    "레이드",
    "레이드 빌더",
    "공격대 편성",
    "공대 편성",
    "버프",
    "유틸",
    "커버리지",
    "버프 커버리지",
    "유틸리티",
    "시너지",
    "외생기",
    "공생기",
    "한밤",
    "Midnight",
    "Midnight Season 1",
    "한밤 시즌 1",
    "Raid Builder",
    "공대장",
    "레이드 조합",
    "공격대 조합",
    "파티 프레임",
    "파티 편성",
    "5인 파티",
    "드래그 앤 드롭",
    "WCL",
    "Raider.IO",
    "Warcraft Logs",
    "아이템 레벨",
    "M+ 점수",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description:
      "WoW Raid Builder — Raid composition analyzer for WoW raid leaders. Buff & utility coverage, party frames, Raider.IO & Warcraft Logs integration. 공격대 버프·유틸 커버리지 분석 도구.",
    locale: "ko_KR",
    siteName: "WoW Raid Builder",
    title: "WoW Raid Builder — Raid Buff & Utility Coverage Analyzer",
    type: "website",
    url: SITE_URL,
  },
  publisher: "gunwoongPark",
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: "WoW Raid Builder — Raid Buff & Utility Coverage Analyzer",
    template: "%s | WoW Raid Builder",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "WoW Raid Builder — Raid composition analyzer for WoW raid leaders. Buff & utility coverage, party frames, Raider.IO & Warcraft Logs integration.",
    title: "WoW Raid Builder — Raid Buff & Utility Coverage Analyzer",
  },
  verification: {
    google: "C5ltSj2PKFCtP1T0Qkhv8AqrK49ecrsuXQ8Tt_kIpH4",
  },
}

export const generateViewport = (): Viewport => ({
  initialScale: 1,
  themeColor: [
    { color: "#f5e6c8", media: "(prefers-color-scheme: light)" },
    { color: "#0a0e1a", media: "(prefers-color-scheme: dark)" },
  ],
  width: "device-width",
})

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html
      suppressHydrationWarning
      className={`${geistMono.variable} ${cinzel.variable} ${pretendard.variable} h-full antialiased`}
      lang="ko"
    >
      <head>
        {/* 외부 이미지 리소스 preconnect — 첫 로드 속도 개선 */}
        <link crossOrigin="anonymous" href="https://wow.zamimg.com" rel="preconnect" />
        <link href="https://render.worldofwarcraft.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://cdnassets.raider.io" rel="preconnect" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <AppThemeProvider>
          <QueryProvider>
            <div className="flex min-h-dvh flex-col">
              <div className="flex-1">{children}</div>
              <AppFooter />
            </div>
          </QueryProvider>
          <ThemeToggle />
          <AppToaster />
          <NetworkStatusMonitor />
          <Analytics />
          <SpeedInsights />
        </AppThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
