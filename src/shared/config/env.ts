export const env = {
  blizzard: {
    clientId: process.env.BLIZZARD_CLIENT_ID ?? "",
    clientSecret: process.env.BLIZZARD_CLIENT_SECRET ?? "",
  },
  warcraftLogs: {
    clientId: process.env.WARCRAFT_LOGS_CLIENT_ID ?? "",
    clientSecret: process.env.WARCRAFT_LOGS_CLIENT_SECRET ?? "",
  },
} satisfies Record<string, unknown>
