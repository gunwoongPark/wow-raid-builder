"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

export const AppToaster = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Toaster
      position="bottom-right"
      theme={isDark ? "dark" : "light"}
      toastOptions={
        isDark
          ? {
              classNames: {
                description: "text-amber-100/60 text-xs",
                error: "!bg-[#1a0808] !border-red-800/60",
                success: "!bg-[#081a0a] !border-emerald-700/60",
                title: "!text-amber-400 !font-bold !text-sm",
                toast:
                  "fantasy !bg-[#120d06] !border !border-amber-800/50 !text-amber-100 !shadow-2xl !rounded-md",
              },
            }
          : {
              classNames: {
                description: "text-stone-500 text-xs",
                title: "!text-stone-800 !font-bold !text-sm",
                toast: "!shadow-lg !rounded-md",
              },
            }
      }
    />
  )
}
