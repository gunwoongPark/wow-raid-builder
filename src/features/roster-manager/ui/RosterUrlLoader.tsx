"use client"

// useSearchParams는 반드시 <Suspense> 안에 있어야 함 — page.tsx에서 감싸줌
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

import { decodeRosterParam } from "@/shared/lib/roster-url"

import { useRosterSync } from "../model/useRosterSync"

export const RosterUrlLoader = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { loadFromUrl } = useRosterSync()
  const executed = useRef(false)

  useEffect(() => {
    // executed.current로 한 번만 실행 — searchParams가 deps에 있어도 재실행 방지
    if (executed.current) return
    const r = searchParams.get("r")
    if (!r) return

    executed.current = true
    const entries = decodeRosterParam(r)
    if (!entries.length) return

    loadFromUrl(entries).then(() => {
      // 로드 완료 후 ?r= 제거 — history에 남기지 않음
      router.replace("/", { scroll: false })
    })
  }, [loadFromUrl, router, searchParams])

  return null
}
