"use client"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Image from "next/image"
import { type ChangeEvent, type FormEvent, type KeyboardEvent, useRef, useState } from "react"
import { toast } from "sonner"

import {
  buildRaiderIOProfile,
  characterApi,
  characterQueries,
  type CharacterSearchResult,
  MAX_ROSTER_SIZE,
  useRosterStore,
} from "@/entities/character"
import { useDebounce } from "@/shared/lib/use-debounce"

export const CharacterSearchForm = () => {
  // 변수부 — 스토어
  // characters 배열 전체 대신 length만 구독 — raiderIO/warcraftLogs 업데이트 시 불필요한 리렌더 방지
  const characterCount = useRosterStore((store) => store.characters.length)
  const addCharacter = useRosterStore((store) => store.addCharacter)
  const updateCharacter = useRosterStore((store) => store.updateCharacter)
  const setPendingRaiderIO = useRosterStore((store) => store.setPendingRaiderIO)
  const setPendingWCL = useRosterStore((store) => store.setPendingWCL)

  // 변수부 — 로컬 상태
  const [query, setQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Enter 입력 시 debounce를 건너뛰고 즉시 검색을 트리거하기 위한 상태
  const [instantQuery, setInstantQuery] = useState("")
  const debouncedQuery = useDebounce(query, 250)
  const effectiveQuery = instantQuery.length >= 2 ? instantQuery : debouncedQuery
  const inputRef = useRef<HTMLInputElement>(null)

  // 변수부 — 쿼리
  const { data: searchResults = [], isFetching } = useQuery(characterQueries.search(effectiveQuery))

  // 함수
  const onSelect = async (result: CharacterSearchResult | null) => {
    if (!result) return

    const characterId = `${result.realmSlug}-${result.name.toLowerCase()}`
    // 액션 시점에 최신 상태를 getState()로 읽어 구독 없이 중복 체크
    const { characters } = useRosterStore.getState()
    if (characters.some((character) => character.id === characterId)) {
      toast.error("이미 공격대에 추가된 캐릭터입니다.", {
        description: `${result.name}은(는) 이미 공격대 목록에 있습니다.`,
      })
      return
    }

    if (characterCount >= MAX_ROSTER_SIZE) {
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
      setInstantQuery("")
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        setErrorMessage(
          status === 404
            ? `"${result.name}" 캐릭터를 블리자드 서버에서 찾을 수 없습니다. 이름 변경이나 서버 이전이 있었을 수 있어요.`
            : status !== undefined && status >= 500
              ? "블리자드 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
              : "캐릭터 정보를 불러오지 못했습니다."
        )
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "캐릭터 정보를 불러오지 못했습니다."
        )
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handlePreventDefault = (e: FormEvent<HTMLFormElement>) => e.preventDefault()
  const getDisplayValue = () => query

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setInstantQuery("") // 새로 타이핑 시 즉시검색 초기화 → debounce로 복귀
    setErrorMessage(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || query.length < 2) return
    // debounce를 건너뛰고 즉시 검색 실행
    // preventDefault 없음 → 옵션이 포커스되어 있으면 Headless UI가 Enter로 선택 가능
    setInstantQuery(query)
  }

  // 렌더
  return (
    <form className="flex flex-col gap-2" onSubmit={handlePreventDefault}>
      {/*
        immediate: 포커스 즉시 열림 → blur 시 자연스럽게 닫힘 (static 없이도 외부 클릭 닫힘 해결)
        static 미사용: Headless UI가 open/close 직접 관리 (blur, Escape, 선택 모두 자동 처리)
      */}
      <Combobox immediate onChange={onSelect}>
        <div className="relative">
          <ComboboxInput
            className="wow-input border-border/60 bg-input text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2.5 pr-24 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isAdding || characterCount >= MAX_ROSTER_SIZE}
            displayValue={getDisplayValue}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            placeholder={
              characterCount >= MAX_ROSTER_SIZE
                ? `최대 ${MAX_ROSTER_SIZE}명 도달`
                : "캐릭터명 검색 (예: 액흑)"
            }
          />

          {(isFetching || isAdding) && (
            <span className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5 text-xs">
              <span className="border-muted-foreground/40 border-t-primary inline-block size-3 animate-spin rounded-full border-2" />
              {isAdding ? "추가 중…" : "검색 중…"}
            </span>
          )}

          {/*
            hidden: query < 2자일 때 포커스되어도 빈 드롭다운이 보이지 않도록 억제
            static 없음: Headless UI가 blur 시 자동으로 닫아줌
          */}
          <ComboboxOptions
            className="border-border/60 bg-popover absolute z-9999 mt-1 max-h-64 w-full overflow-auto rounded-md border shadow-xl [background:var(--popover)]"
            hidden={query.length < 2}
          >
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <ComboboxOption
                  className="text-foreground data-focus:bg-primary/10 flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors"
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
                      {result.totalBosses !== null && (
                        <>
                          {(result.heroicKills ?? 0) > 0 && (
                            <span className="ml-1.5 text-blue-700 dark:text-blue-400">
                              H {result.heroicKills}/{result.totalBosses}
                            </span>
                          )}
                          {(result.mythicKills ?? 0) > 0 && (
                            <span className="ml-1.5 text-amber-700 dark:text-yellow-500">
                              M {result.mythicKills}/{result.totalBosses}
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </ComboboxOption>
              ))
            ) : !isFetching ? (
              <p className="text-muted-foreground px-3 py-2.5 text-sm">검색 결과가 없습니다.</p>
            ) : null}
          </ComboboxOptions>
        </div>
      </Combobox>

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </form>
  )
}
