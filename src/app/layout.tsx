import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { QueryProvider } from "@/shared/lib/query-provider"

import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} lang="ko">
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
