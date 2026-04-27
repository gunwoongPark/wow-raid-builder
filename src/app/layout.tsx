import type { Metadata } from "next"
import { Cinzel, Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import { QueryProvider } from "@/shared/lib/query-provider"
import { AppThemeProvider } from "@/shared/lib/theme-provider"
import { ThemeToggle } from "@/shared/ui/ThemeToggle"

import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
      lang="ko"
    >
      <body className="flex min-h-full flex-col">
        <AppThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <ThemeToggle />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                description: "text-amber-100/60 text-xs",
                error: "!bg-[#1a0808] !border-red-800/60",
                success: "!bg-[#081a0a] !border-emerald-700/60",
                title: "!text-amber-400 !font-bold !text-sm",
                toast:
                  "fantasy !bg-[#120d06] !border !border-amber-800/50 !text-amber-100 !shadow-2xl !rounded-md",
              },
            }}
          />
        </AppThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
