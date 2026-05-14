import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { Cinzel, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import { type ReactNode } from "react"

import { SITE_URL } from "@/shared/config/site"
import { QueryProvider } from "@/shared/lib/query-provider"
import { AppThemeProvider } from "@/shared/lib/theme-provider"
import { AppFooter } from "@/shared/ui/AppFooter"
import { AppToaster } from "@/shared/ui/AppToaster"
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher"
import { NetworkStatusMonitor } from "@/shared/ui/NetworkStatusMonitor"
import { ThemeToggle } from "@/shared/ui/ThemeToggle"

import "../globals.css"

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
  src: "../../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
})

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({ params }: LocaleLayoutProps): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })

  const isKorean = locale === "ko"
  const localizedUrl = isKorean ? SITE_URL : `${SITE_URL}/en`

  return {
    alternates: {
      canonical: localizedUrl,
      languages: {
        en: `${SITE_URL}/en`,
        "ko-KR": SITE_URL,
      },
    },
    applicationName: "RaidScope",
    authors: [{ name: "gunwoongPark", url: "https://github.com/gunwoongPark" }],
    category: "game",
    creator: "gunwoongPark",
    description: t("description"),
    keywords: t("keywords").split(", "),
    metadataBase: new URL(SITE_URL),
    openGraph: {
      description: t("ogDescription"),
      locale: isKorean ? "ko_KR" : "en_US",
      siteName: "RaidScope",
      title: t("ogTitle"),
      type: "website",
      url: localizedUrl,
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
      default: t("title"),
      template: `%s | RaidScope`,
    },
    twitter: {
      card: "summary_large_image",
      description: t("ogDescription"),
      title: t("ogTitle"),
    },
    verification: {
      google: "C5ltSj2PKFCtP1T0Qkhv8AqrK49ecrsuXQ8Tt_kIpH4",
    },
  }
}

export const generateViewport = (): Viewport => ({
  initialScale: 1,
  themeColor: [
    { color: "#f5e6c8", media: "(prefers-color-scheme: light)" },
    { color: "#0a0e1a", media: "(prefers-color-scheme: dark)" },
  ],
  width: "device-width",
})

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html
      suppressHydrationWarning
      className={`${geistMono.variable} ${cinzel.variable} ${pretendard.variable} h-full antialiased`}
      lang={locale}
    >
      <head>
        <link crossOrigin="anonymous" href="https://wow.zamimg.com" rel="preconnect" />
        <link href="https://render.worldofwarcraft.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://cdnassets.raider.io" rel="preconnect" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages}>
          <AppThemeProvider>
            <QueryProvider>
              <div className="flex min-h-dvh flex-col">
                <div className="flex-1">{children}</div>
                <AppFooter />
              </div>
            </QueryProvider>
            <ThemeToggle />
            <LanguageSwitcher />
            <AppToaster />
            <NetworkStatusMonitor />
            <Analytics />
            <SpeedInsights />
          </AppThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
