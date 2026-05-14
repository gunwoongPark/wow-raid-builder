"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()

  useEffect(() => {
    // persist skipHydration: true 설정으로 인해 수동으로 rehydrate 호출
    // 서버·클라이언트 첫 렌더를 일치시켜 CLS를 줄이기 위한 구조
    useRosterStore.persist.rehydrate()

    if (initialized.current || characters.length === 0) return
    initialized.current = true

    const { addCharacter, assignToParty } = useRosterStore.getState()

    characters.forEach((character) => addCharacter(character))

    entries.forEach(({ name, partyNumber, realmSlug }) => {
      if (partyNumber !== undefined) {
        assignToParty(`${realmSlug}-${name.toLowerCase()}`, partyNumber)
      }
    })

    // ?r= 제거하되 view, sort, dir 등 다른 파라미터는 유지
    const params = new URLSearchParams(searchParams.toString())
    params.delete("r")
    const query = params.toString()
    router.replace(query ? `/?${query}` : "/", { scroll: false })
  }, [characters, entries, router, searchParams])

  return null
}
