"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export const NetworkStatusMonitor = () => {
  const t = useTranslations("network")
  const toastIdRef = useRef<string | number | null>(null)

  useEffect(() => {
    const handleOffline = () => {
      toastIdRef.current = toast.error(t("offline"), {
        description: t("offlineDesc"),
        duration: Infinity,
      })
    }

    const handleOnline = () => {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current)
        toastIdRef.current = null
      }
      toast.success(t("online"))
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [t])

  return null
}
