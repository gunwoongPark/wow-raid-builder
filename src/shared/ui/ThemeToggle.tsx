"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const THEMES = [
  { icon: "☀️", label: "라이트", value: "light" },
  { icon: "🌙", label: "다크", value: "dark" },
  { icon: "💻", label: "시스템", value: "system" },
] as const

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

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      setMounted(true)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="border-border/60 bg-card/90 fixed bottom-5 left-5 z-50 flex flex-col gap-1 rounded-xl border p-1.5 shadow-xl backdrop-blur-sm">
      {THEMES.map(({ icon, label, value }) => (
        <ThemeButton
          icon={icon}
          isActive={theme === value}
          key={value}
          label={label}
          onSelect={setTheme}
          value={value}
        />
      ))}
    </div>
  )
}
