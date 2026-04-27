export type LogVariant = "legendary" | "epic" | "rare" | "uncommon" | "default"

/** WCL 로그 % 구간에 따라 Tailwind 텍스트 색상 클래스 반환 */
export const logColorClass = (percent: number): string =>
  percent >= 95
    ? "text-yellow-400 font-bold"
    : percent >= 75
      ? "text-purple-400"
      : percent >= 50
        ? "text-blue-400"
        : percent >= 25
          ? "text-green-400"
          : "text-muted-foreground"

/** WCL 로그 % 구간에 따라 warcraftcn Tooltip variant 반환 */
export const logVariant = (percent: number): LogVariant =>
  percent >= 95
    ? "legendary"
    : percent >= 75
      ? "epic"
      : percent >= 50
        ? "rare"
        : percent >= 25
          ? "uncommon"
          : "default"
