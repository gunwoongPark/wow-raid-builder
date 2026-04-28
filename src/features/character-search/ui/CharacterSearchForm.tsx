"use client"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  buildRaiderIOProfile,
  characterApi,
  characterQueries,
  type CharacterSearchResult,
} from "@/entities/character"
import { useDebounce } from "@/shared/lib/use-debounce"
import { MAX_ROSTER_SIZE, useRosterStore } from "@/shared/model/roster-store"

import { characterSearchSchema, type CharacterSearchSchema } from "../schema"

export const CharacterSearchForm = () => {
  // 변수부 — 스토어
  const addCharacter = useRosterStore((store) => store.addCharacter)
  const updateCharacter = useRosterStore((store) => store.updateCharacter)
  const characters = useRosterStore((store) => store.characters)
  const setPendingRaiderIO = useRosterStore((store) => store.setPendingRaiderIO)
  const setPendingWCL = useRosterStore((store) => store.setPendingWCL)

  // 변수부 — 로컬 상태
  const [query, setQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 350)
  const inputRef = useRef<HTMLInputElement>(null)

  // 변수부 — 폼 / 쿼리
  const { handleSubmit } = useForm<CharacterSearchSchema>({
    resolver: zodResolver(characterSearchSchema),
  })

  const { data: searchResults = [], isFetching } = useQuery({
    ...characterQueries.search(debouncedQuery),
    placeholderData: (previous) => previous,
  })

  // 함수
  const onSelect = async (result: CharacterSearchResult | null) => {
    if (!result) return

    const characterId = `${result.realmSlug}-${result.name.toLowerCase()}`
    if (characters.some((character) => character.id === characterId)) {
      toast.error("이미 공격대에 추가된 캐릭터입니다.", {
        description: `${result.name}은(는) 이미 공격대 목록에 있습니다.`,
      })
      return
    }

    if (characters.length >= MAX_ROSTER_SIZE) {
      toast.warning("공격대 인원 초과", {
        description: `공격대원은 최대 ${MAX_ROSTER_SIZE}명까지 추가할 수 있습니다.`,
      })
      return
    }

    setIsAdding(true)
    setErrorMessage(null)

    try {
      const characterData = await characterApi.getSummary(result.realmSlug, result.name)
      addCharacter({ ...characterData, raiderIO: null, warcraftLogs: null })
      setPendingRaiderIO(characterId, true)
      setPendingWCL(characterId, true)
      setQuery("")
      inputRef.current?.blur()

      characterApi
        .getRaiderIO(result.realmSlug, result.name)
        .then((data) => updateCharacter(characterId, { raiderIO: buildRaiderIOProfile(data) }))
        .catch(() =>
          toast.error("Raider.IO 데이터 로드 실패", {
            description: `${result.name}의 M+ 점수·레이드 진행도를 불러오지 못했습니다.`,
          })
        )
        .finally(() => setPendingRaiderIO(characterId, false))

      characterApi
        .getWarcraftLogs(result.realmSlug, result.name)
        .then((data) => updateCharacter(characterId, { warcraftLogs: data }))
        .catch(() =>
          toast.error("Warcraft Logs 데이터 로드 실패", {
            description: `${result.name}의 로그 %를 불러오지 못했습니다.`,
          })
        )
        .finally(() => setPendingWCL(characterId, false))
    } catch (error) {
      const axiosStatus = (error as { response?: { status?: number } }).response?.status
      const message =
        axiosStatus === 404
          ? `"${result.name}" 캐릭터를 블리자드 서버에서 찾을 수 없습니다. 이름 변경이나 서버 이전이 있었을 수 있어요.`
          : axiosStatus !== undefined && axiosStatus >= 500
            ? "블리자드 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            : error instanceof Error
              ? error.message
              : "캐릭터 정보를 불러오지 못했습니다."
      setErrorMessage(message)
    } finally {
      setIsAdding(false)
    }
  }

  // 렌더
  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(() => {})}>
      <Combobox immediate onChange={onSelect}>
        <div className="relative">
          <ComboboxInput
            className="wow-input border-border/60 bg-input text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2.5 pr-24 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isAdding}
            displayValue={() => query}
            placeholder="캐릭터명 검색 (예: 액흑)"
            ref={inputRef}
            onChange={(event) => {
              setQuery(event.target.value)
              setErrorMessage(null)
            }}
          />

          {(isFetching || isAdding) && (
            <span className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5 text-xs">
              <span className="border-muted-foreground/40 border-t-primary inline-block size-3 animate-spin rounded-full border-2" />
              {isAdding ? "추가 중…" : "검색 중…"}
            </span>
          )}

          {searchResults.length > 0 && debouncedQuery.length >= 2 && (
            <ComboboxOptions className="border-border/60 bg-popover absolute z-[9999] mt-1 max-h-64 w-full overflow-auto rounded-md border shadow-xl [background:var(--popover)]">
              {searchResults.map((result) => (
                <ComboboxOption
                  className="text-foreground data-[focus]:bg-primary/10 flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors"
                  key={result.realmSlug}
                  value={result}
                >
                  {result.thumbnailUrl && (
                    <Image
                      alt={result.name}
                      className="border-border/50 size-9 rounded border"
                      height={36}
                      src={result.thumbnailUrl}
                      width={36}
                    />
                  )}
                  <div>
                    <p className="text-foreground font-semibold">{result.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {result.realm} · {result.specName} {result.className}
                      {result.score > 0 && (
                        <span className="text-primary ml-1.5">
                          M+ {result.score.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}

          {!isFetching && debouncedQuery.length >= 2 && searchResults.length === 0 && (
            <ComboboxOptions className="border-border/60 bg-popover absolute z-[9999] mt-1 w-full rounded-md border shadow-xl [background:var(--popover)]">
              <p className="text-muted-foreground px-3 py-2.5 text-sm">검색 결과가 없습니다.</p>
            </ComboboxOptions>
          )}
        </div>
      </Combobox>

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </form>
  )
}
