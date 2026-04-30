import type { Metadata } from "next"
import { Cinzel, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { QueryProvider } from "@/shared/lib/query-provider"
import { AppThemeProvider } from "@/shared/lib/theme-provider"
import { AppToaster } from "@/shared/ui/AppToaster"
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
  description: "WoW 공대 구성 자동 분석기",
  title: "WoW Raid Builder",
}

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
        </AppThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
