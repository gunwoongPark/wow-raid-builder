"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

import { type RosterCharacter, type RosterUrlEntry, useRosterStore } from "@/entities/character"

interface RosterInitializerProps {
  characters: RosterCharacter[]
  entries: RosterUrlEntry[]
}

/**
 * SSR에서 서버가 fetch한 캐릭터 데이터를 클라이언트 Zustand 스토어에 주입.
 * useEffect로 hydration 직후 단 한 번 실행되며, ?r= URL 파라미터도 제거한다.
 */
export const RosterInitializer = ({ characters, entries }: RosterInitializerProps) => {
  const initialized = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (initialized.current || characters.length === 0) return
    initialized.current = true

    const { addCharacter, assignToParty } = useRosterStore.getState()

    characters.forEach(addCharacter)

    entries.forEach(({ name, partyNumber, realmSlug }) => {
      if (partyNumber !== undefined) {
        assignToParty(`${realmSlug}-${name.toLowerCase()}`, partyNumber)
      }
    })

    // 히스토리에 ?r= 남기지 않음
    router.replace("/", { scroll: false })
  }, [characters, entries, router])

  return null
}
