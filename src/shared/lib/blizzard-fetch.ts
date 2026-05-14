import { getBlizzardClient } from "@/shared/api/blizzard-client"
import { type GameRegion, REGION_CONFIG } from "@/shared/config/region"

type Namespace = keyof typeof REGION_CONFIG.kr.namespace

interface BlizzardFetchOptions {
  namespace?: Namespace
  region: GameRegion
}

export const blizzardFetch = async <T>(
  path: string,
  { namespace = "profile", region }: BlizzardFetchOptions
): Promise<T> => {
  const client = getBlizzardClient(region)
  const { data } = await client.get<T>(path, {
    headers: {
      "Battlenet-Namespace": REGION_CONFIG[region].namespace[namespace],
    },
  })
  return data
}
