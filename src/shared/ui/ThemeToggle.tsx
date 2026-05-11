"use client"

import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const THEME_OPTIONS = [
  { icon: "☀️", value: "light" },
  { icon: "🌙", value: "dark" },
  { icon: "💻", value: "system" },
] as const

type ThemeValue = (typeof THEME_OPTIONS)[number]["value"]

interface ThemeButtonProps {
  icon: string
  isActive: boolean
  label: string
  onSelect: (value: string) => void
  value: string
}

const ThemeButton = ({ icon, isActive, label, onSelect, value }: ThemeButtonProps) => {
  const handleClick = () => onSelect(value)

  return (
    <button
      onClick={handleClick}
      title={label}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors",
        isActive
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const mountedRef = useRef(false)
  const t = useTranslations("theme")

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      setMounted(true)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="border-border/60 bg-card/90 fixed bottom-5 left-5 z-50 flex flex-col gap-1 rounded-xl border p-1.5 shadow-xl backdrop-blur-sm">
      {THEME_OPTIONS.map(({ icon, value }) => (
        <ThemeButton
          icon={icon}
          isActive={theme === value}
          key={value}
          label={t(value satisfies ThemeValue)}
          onSelect={setTheme}
          value={value}
        />
      ))}
    </div>
  )
}
