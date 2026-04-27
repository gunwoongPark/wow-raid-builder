"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { characterApi, type RosterCharacter } from "@/entities/character"
import { useRosterStore } from "@/shared/model/roster-store"

import { characterSearchSchema, type CharacterSearchSchema } from "../schema"

export const CharacterSearchForm = () => {
  const addCharacter = useRosterStore((s) => s.addCharacter)
  const characters = useRosterStore((s) => s.characters)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CharacterSearchSchema>({
    defaultValues: { name: "", realm: "줄진" },
    resolver: zodResolver(characterSearchSchema),
  })

  const onSubmit = async ({ name, realm }: CharacterSearchSchema) => {
    const id = `${realm}-${name.toLowerCase()}`
    if (characters.some((c) => c.id === id)) {
      setError("이미 로스터에 추가된 캐릭터입니다.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Blizzard + Raider.IO 병렬 조회
      const [character, raiderIO] = await Promise.allSettled([
        characterApi.getSummary(realm, name),
        characterApi.getRaiderIO(realm, name),
      ])

      if (character.status === "rejected") {
        setError("캐릭터를 찾을 수 없습니다. 서버명과 캐릭터명을 확인해주세요.")
        return
      }

      const result: RosterCharacter = {
        ...character.value,
        raiderIO:
          raiderIO.status === "fulfilled"
            ? {
                profileUrl: raiderIO.value.profile_url,
                raidProgression: raiderIO.value.raid_progression ?? {},
                score: raiderIO.value.mythic_plus_scores_by_season?.[0]?.scores.all ?? 0,
                thumbnailUrl: raiderIO.value.thumbnail_url,
              }
            : null,
      }

      addCharacter(result)
      reset({ name: "", realm })
    } catch {
      setError("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <input
            {...register("realm")}
            className="w-32 rounded border px-3 py-2 text-sm"
            placeholder="서버 (예: 줄진)"
          />
          {errors.realm && <span className="text-xs text-red-500">{errors.realm.message}</span>}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <input
            {...register("name")}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="캐릭터명"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>

        <button
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white disabled:opacity-50"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "조회 중..." : "추가"}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  )
}
