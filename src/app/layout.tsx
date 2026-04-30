import type { Metadata, Viewport } from "next"
import { Cinzel, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { QueryProvider } from "@/shared/lib/query-provider"
import { AppThemeProvider } from "@/shared/lib/theme-provider"
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://wow-raid-builder.vercel.app"

export const metadata: Metadata = {
  alternates: {
    canonical: BASE_URL,
  },
  authors: [{ name: "WoW Raid Builder" }],
  description:
    "공대장을 위한 공격대 구성 분석 도구. 캐릭터를 검색해 버프·유틸 커버리지를 한눈에 파악하세요. 한밤(Midnight) 시즌 1 기준.",
  keywords: [
    "WoW",
    "World of Warcraft",
    "공격대",
    "공대",
    "레이드",
    "버프",
    "유틸",
    "커버리지",
    "한밤",
    "Midnight",
    "Raid Builder",
    "공대장",
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    description:
      "공대장을 위한 공격대 구성 분석 도구. 캐릭터를 검색해 버프·유틸 커버리지를 한눈에 파악하세요.",
    locale: "ko_KR",
    siteName: "WoW Raid Builder",
    title: "WoW Raid Builder",
    type: "website",
    url: BASE_URL,
  },
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: "WoW Raid Builder",
    template: "%s | WoW Raid Builder",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "공대장을 위한 공격대 구성 분석 도구. 캐릭터를 검색해 버프·유틸 커버리지를 한눈에 파악하세요.",
    title: "WoW Raid Builder",
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
      <body className="flex min-h-full flex-col">
        <AppThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <ThemeToggle />
          <AppToaster />
          <NetworkStatusMonitor />
        </AppThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
