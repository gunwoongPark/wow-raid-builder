"use client"

import { useCallback, useState } from "react"

import { characterApi } from "@/entities/character/api"
import { type RaiderIOProfile, type RosterCharacter } from "@/entities/character/types"
import { buildShareUrl, extractRealmSlug, type RosterUrlEntry } from "@/shared/lib/roster-url"
import { useRosterStore } from "@/shared/model/roster-store"

// 3개 API 병렬 조회 후 RosterCharacter 조립 — 새로고침/URL 로드 공용
const fetchCharacter = async (realmSlug: string, name: string): Promise<RosterCharacter | null> => {
  const [character, raiderIO, warcraftLogs] = await Promise.allSettled([
    characterApi.getSummary(realmSlug, name),
    characterApi.getRaiderIO(realmSlug, name),
    characterApi.getWarcraftLogs(realmSlug, name),
  ])

  if (character.status === "rejected") return null

  const buildRaiderIO = (data: RaiderIOProfile) => ({
    profileUrl: data.profile_url,
    raidProgression: data.raid_progression ?? {},
    score: data.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
    thumbnailUrl: data.thumbnail_url,
  })

  return {
    ...character.value,
    raiderIO:
      raiderIO.status === "fulfilled" && raiderIO.value ? buildRaiderIO(raiderIO.value) : null,
    warcraftLogs: warcraftLogs.status === "fulfilled" ? warcraftLogs.value : null,
  }
}

interface RosterSyncState {
  // 전체 새로고침 중인지
  isRefreshing: boolean
  // 개별 새로고침 중인 character id Set
  refreshingIds: Set<string>
}

export const useRosterSync = () => {
  const characters = useRosterStore((s) => s.characters)
  const addCharacter = useRosterStore((s) => s.addCharacter)
  const updateCharacter = useRosterStore((s) => s.updateCharacter)

  const [state, setState] = useState<RosterSyncState>({
    isRefreshing: false,
    refreshingIds: new Set(),
  })

  // 단일 캐릭터 새로고침
  const refreshOne = useCallback(
    async (id: string) => {
      const char = characters.find((c) => c.id === id)
      if (!char) return

      setState((prev) => ({
        ...prev,
        refreshingIds: new Set([...prev.refreshingIds, id]),
      }))

      try {
        const realmSlug = extractRealmSlug(char.id, char.name)
        const fresh = await fetchCharacter(realmSlug, char.name)
        if (fresh) updateCharacter(id, fresh)
      } finally {
        setState((prev) => {
          const next = new Set(prev.refreshingIds)
          next.delete(id)
          return { ...prev, refreshingIds: next }
        })
      }
    },
    [characters, updateCharacter]
  )

  // 전체 캐릭터 새로고침 (병렬)
  const refreshAll = useCallback(async () => {
    if (state.isRefreshing || !characters.length) return

    setState((prev) => ({ ...prev, isRefreshing: true }))
    try {
      await Promise.allSettled(
        characters.map(async (char) => {
          const realmSlug = extractRealmSlug(char.id, char.name)
          const fresh = await fetchCharacter(realmSlug, char.name)
          if (fresh) updateCharacter(char.id, fresh)
        })
      )
    } finally {
      setState((prev) => ({ ...prev, isRefreshing: false }))
    }
  }, [characters, state.isRefreshing, updateCharacter])

  // URL에서 캐릭터 로드 — 없으면 추가, 있으면 최신화
  const loadFromUrl = useCallback(
    async (entries: RosterUrlEntry[]) => {
      if (!entries.length) return

      setState((prev) => ({ ...prev, isRefreshing: true }))
      try {
        // 현재 store 상태는 Zustand getState()로 항상 최신값 참조
        await Promise.allSettled(
          entries.map(async ({ name, realmSlug }) => {
            const id = `${realmSlug}-${name.toLowerCase()}`
            const fresh = await fetchCharacter(realmSlug, name)
            if (!fresh) return

            const { characters: current } = useRosterStore.getState()
            if (current.some((c) => c.id === id)) {
              updateCharacter(id, fresh)
            } else {
              addCharacter(fresh)
            }
          })
        )
      } finally {
        setState((prev) => ({ ...prev, isRefreshing: false }))
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
