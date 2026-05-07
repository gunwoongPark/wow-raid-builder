"use client"

import { useTheme } from "next-themes"

export const useIsDarkMode = () => useTheme().resolvedTheme === "dark"
