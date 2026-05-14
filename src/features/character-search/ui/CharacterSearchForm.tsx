"use client"

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { type ChangeEvent, type FormEvent, type KeyboardEvent, useRef, useState } from "react"
import { toast } from "sonner"

import {
  buildRaiderIOProfile,
  characterApi,
  characterQueries,
  type CharacterSearchResult,
  MAX_ROSTER_SIZE,
  normalizeName,
  useRosterStore,
} from "@/entities/character"
import { useDebounce } from "@/shared/lib/use-debounce"

export const CharacterSearchForm = () => {
  const characterCount = useRosterStore((store) => store.characters.length)
  const addCharacter = useRosterStore((store) => store.addCharacter)
  const updateCharacter = useRosterStore((store) => store.updateCharacter)
  const setPendingRaiderIO = useRosterStore((store) => store.setPendingRaiderIO)
  const setPendingWCL = useRosterStore((store) => store.setPendingWCL)

  const [query, setQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [instantQuery, setInstantQuery] = useState("")
  const debouncedQuery = useDebounce(query, 250)
  const effectiveQuery = instantQuery.length >= 2 ? instantQuery : debouncedQuery
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: searchResults = [], isFetching } = useQuery(characterQueries.search(effectiveQuery))

  const t = useTranslations("search")
  const tClass = useTranslations("className")
  const tSpec = useTranslations("specById")

  const onSelect = async (result: CharacterSearchResult | null) => {
    if (!result) return

    const characterId = `${result.realmSlug}-${result.name.toLowerCase()}`
    const { characters } = useRosterStore.getState()
    if (characters.some((character) => character.id === characterId)) {
      toast.error(t("toast.duplicate"), {
        description: t("toast.duplicateDesc", { name: result.name }),
      })
      return
    }

    if (characterCount >= MAX_ROSTER_SIZE) {
      toast.warning(t("toast.maxReached"), {
        description: t("toast.maxReachedDesc", { max: MAX_ROSTER_SIZE }),
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
          toast.error(t("toast.raiderioFail"), {
            description: t("toast.raiderioFailDesc", { name: result.name }),
          })
        )
        .finally(() => setPendingRaiderIO(characterId, false))

      characterApi
        .getWarcraftLogs(result.realmSlug, result.name)
        .then((data) => updateCharacter(characterId, { warcraftLogs: data }))
        .catch(() =>
          toast.error(t("toast.wclFail"), {
            description: t("toast.wclFailDesc", { name: result.name }),
          })
        )
        .finally(() => setPendingWCL(characterId, false))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        setErrorMessage(
          status === 404
            ? t("error.notFound", { name: result.name })
            : status !== undefined && status >= 500
              ? t("error.serverError")
              : t("error.generic")
        )
      } else {
        setErrorMessage(error instanceof Error ? error.message : t("error.generic"))
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handlePreventDefault = (e: FormEvent<HTMLFormElement>) => e.preventDefault()
  const getDisplayValue = () => query

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setInstantQuery("")
    setErrorMessage(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || query.length < 2) return
    if (searchResults.length === 0) {
      event.preventDefault()
    }
    setInstantQuery(query)
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handlePreventDefault}>
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
                ? t("placeholderMax", { max: MAX_ROSTER_SIZE })
                : t("placeholder")
            }
          />

          {(isFetching || isAdding) && (
            <span className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5 text-xs">
              <span className="border-muted-foreground/40 border-t-primary inline-block size-3 animate-spin rounded-full border-2" />
              {isAdding ? t("adding") : t("searching")}
            </span>
          )}

          <ComboboxOptions
            className="border-border/60 bg-popover absolute z-9999 mt-1 max-h-64 w-full overflow-auto rounded-md border shadow-xl [background:var(--popover)]"
            hidden={query.length < 2}
          >
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <ComboboxOption
                  className="text-foreground data-focus:bg-primary/10 flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors"
                  key={`${result.realmSlug}-${result.name}`}
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
                      {result.realm} · {tSpec(String(result.specId))}{" "}
                      {tClass(normalizeName(result.className))}
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
              <p className="text-muted-foreground px-3 py-2.5 text-sm">{t("noResults")}</p>
            ) : null}
          </ComboboxOptions>
        </div>
      </Combobox>

      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </form>
  )
}
