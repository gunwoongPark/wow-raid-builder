"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

export const NetworkStatusMonitor = () => {
  const toastIdRef = useRef<string | number | null>(null)

  useEffect(() => {
    const handleOffline = () => {
      toastIdRef.current = toast.error("인터넷 연결이 끊어졌습니다.", {
        description: "네트워크 상태를 확인해 주세요.",
        duration: Infinity,
      })
    }

    const handleOnline = () => {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current)
        toastIdRef.current = null
      }
      toast.success("인터넷 연결이 복구됐습니다.")
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  return null
}
