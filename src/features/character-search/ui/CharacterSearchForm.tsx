"use client"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { type CharacterSearchResult } from "@/app/api/character/search/route"
import { characterApi, characterQueries, type RosterCharacter } from "@/entities/character"
import { useRosterStore } from "@/shared/model/roster-store"

import { characterSearchSchema, type CharacterSearchSchema } from "../schema"

const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export const CharacterSearchForm = () => {
  const addCharacter = useRosterStore((s) => s.addCharacter)
  const characters = useRosterStore((s) => s.characters)

  const [query, setQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 350)

  const inputRef = useRef<HTMLInputElement>(null)

  const { handleSubmit } = useForm<CharacterSearchSchema>({
    resolver: zodResolver(characterSearchSchema),
  })

  const { data: searchResults = [], isFetching } = useQuery({
    ...characterQueries.search(debouncedQuery),
    placeholderData: (prev) => prev,
  })

  const onSelect = async (result: CharacterSearchResult | null) => {
    if (!result) return

    const id = `${result.realmSlug}-${result.name.toLowerCase()}`
    if (characters.some((c) => c.id === id)) {
      setError("이미 로스터에 추가된 캐릭터입니다.")
      return
    }

    setIsAdding(true)
    setError(null)

    try {
      const [character, raiderIO, warcraftLogs] = await Promise.allSettled([
        characterApi.getSummary(result.realmSlug, result.name),
        characterApi.getRaiderIO(result.realmSlug, result.name),
        characterApi.getWarcraftLogs(result.realmSlug, result.name),
      ])

      if (character.status === "rejected") {
        const msg =
          character.reason?.response?.data?.error ??
          character.reason?.message ??
          "캐릭터를 찾을 수 없습니다."
        setError(msg)
        return
      }

      const added: RosterCharacter = {
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
        warcraftLogs: warcraftLogs.status === "fulfilled" ? warcraftLogs.value : null,
      }

      addCharacter(added)
      setQuery("")
      inputRef.current?.blur()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "오류가 발생했습니다."
      setError(msg)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(() => {})}>
      <Combobox immediate onChange={onSelect}>
        <div className="relative">
          <ComboboxInput
            className="border-border/60 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:ring-1"
            displayValue={() => query}
            placeholder="캐릭터명 검색 (예: 액흑)"
            ref={inputRef}
            onChange={(e) => {
              setQuery(e.target.value)
              setError(null)
            }}
          />

          {isFetching && (
            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs">
              검색 중…
            </span>
          )}

          {searchResults.length > 0 && (
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

      {isAdding && <p className="text-xs text-gray-400">캐릭터 정보를 불러오는 중…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  )
}
