"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { guildQueries } from "@/entities/guild"

import { guildSearchSchema, type GuildSearchSchema } from "../schema"

export const GuildSearchForm = () => {
  const [search, setSearch] = useState<GuildSearchSchema | null>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<GuildSearchSchema>({
    resolver: zodResolver(guildSearchSchema),
  })

  const { data, isError, isLoading } = useQuery({
    ...guildQueries.members(search?.realm ?? "", search?.guildName ?? ""),
    enabled: Boolean(search),
  })

  const onSubmit = (values: GuildSearchSchema) => setSearch(values)

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <input
            {...register("realm")}
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="서버 (예: 줄진)"
          />
          {errors.realm && <span className="text-xs text-red-500">{errors.realm.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("guildName")}
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="길드명"
          />
          {errors.guildName && (
            <span className="text-xs text-red-500">{errors.guildName.message}</span>
          )}
        </div>

        <button
          className="rounded-md bg-amber-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
          type="submit"
        >
          분석 시작
        </button>
      </form>

      {isLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">데이터를 불러오지 못했습니다.</p>}
      {data && (
        <p className="text-sm">
          {data.name} — 멤버 {data.member_count}명
        </p>
      )}
    </div>
  )
}
