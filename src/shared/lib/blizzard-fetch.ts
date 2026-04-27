import { blizzardClient } from "@/shared/api/blizzard-client"
import { env } from "@/shared/config/env"

type Namespace = keyof typeof env.blizzard.namespace

interface BlizzardFetchOptions {
  namespace?: Namespace
}

export const blizzardFetch = async <T>(
  path: string,
  { namespace = "profile" }: BlizzardFetchOptions = {}
): Promise<T> => {
  const { data } = await blizzardClient.get<T>(path, {
    headers: {
      "Battlenet-Namespace": env.blizzard.namespace[namespace],
    },
  })
  return data
}
