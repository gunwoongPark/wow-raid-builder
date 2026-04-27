"use client"

import { ThemeProvider } from "next-themes"
import { type ReactNode } from "react"

export const AppThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider enableSystem attribute="class" defaultTheme="system">
    {children}
  </ThemeProvider>
)
