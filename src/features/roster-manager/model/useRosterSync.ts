"use client"

import { useCallback, useState } from "react"

import {
  buildShareUrl,
  extractRealmSlug,
  MAX_ROSTER_SIZE,
  type RosterUrlEntry,
  useRosterStore,
} from "@/entities/character"

import { fetchCharacter } from "../lib/fetch-character"

interface RosterSyncState {
  isRefreshing: boolean
  refreshingIds: Set<string>
}

export const useRosterSync = () => {
  // 변수부
  const characters = useRosterStore((store) => store.characters)
  const addCharacter = useRosterStore((store) => store.addCharacter)
  const updateCharacter = useRosterStore((store) => store.updateCharacter)

  const [state, setState] = useState<RosterSyncState>({
    isRefreshing: false,
    refreshingIds: new Set(),
  })

  // 단일 캐릭터 새로고침
  const refreshOne = useCallback(
    async (id: string) => {
      const character = characters.find((entry) => entry.id === id)
      if (!character) return

      setState((previous) => ({
        ...previous,
        refreshingIds: new Set([...previous.refreshingIds, id]),
      }))

      try {
        const realmSlug = extractRealmSlug(character.id, character.name)
        const fresh = await fetchCharacter(realmSlug, character.name)
        if (fresh) updateCharacter(id, fresh)
      } finally {
        setState((previous) => {
          const next = new Set(previous.refreshingIds)
          next.delete(id)
          return { ...previous, refreshingIds: next }
        })
      }
    },
    [characters, updateCharacter]
  )

  // 전체 캐릭터 새로고침 (병렬)
  const refreshAll = useCallback(async () => {
    if (state.isRefreshing || !characters.length) return

    setState((previous) => ({ ...previous, isRefreshing: true }))
    try {
      await Promise.allSettled(
        characters.map(async (character) => {
          const realmSlug = extractRealmSlug(character.id, character.name)
          const fresh = await fetchCharacter(realmSlug, character.name)
          if (fresh) updateCharacter(character.id, fresh)
        })
      )
    } finally {
      setState((previous) => ({ ...previous, isRefreshing: false }))
    }
  }, [characters, state.isRefreshing, updateCharacter])

  // URL에서 캐릭터 로드 — 없으면 추가, 있으면 최신화
  const loadFromUrl = useCallback(
    async (entries: RosterUrlEntry[]) => {
      if (!entries.length) return

      setState((previous) => ({ ...previous, isRefreshing: true }))
      try {
        await Promise.allSettled(
          entries.map(async ({ name, realmSlug }) => {
            const id = `${realmSlug}-${name.toLowerCase()}`
            const fresh = await fetchCharacter(realmSlug, name)
            if (!fresh) return

            const { characters: current } = useRosterStore.getState()
            if (current.some((character) => character.id === id)) {
              updateCharacter(id, fresh)
            } else if (current.length < MAX_ROSTER_SIZE) {
              addCharacter(fresh)
            }
          })
        )
      } finally {
        setState((previous) => ({ ...previous, isRefreshing: false }))
      }
    },
    [addCharacter, updateCharacter]
  )

  // 현재 로스터를 URL로 인코딩 후 클립보드 복사
  const copyShareUrl = useCallback(() => {
    if (!characters.length) return
    const url = buildShareUrl(characters)
    navigator.clipboard.writeText(url)
  }, [characters])

  return {
    copyShareUrl,
    isRefreshing: state.isRefreshing,
    loadFromUrl,
    refreshAll,
    refreshingIds: state.refreshingIds,
    refreshOne,
  }
}
