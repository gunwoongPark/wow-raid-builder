export const env = {
  blizzard: {
    clientId: process.env.BLIZZARD_CLIENT_ID ?? "",
    clientSecret: process.env.BLIZZARD_CLIENT_SECRET ?? "",
    locale: "ko_KR",
    namespace: {
      dynamic: "dynamic-kr",
      profile: "profile-kr",
      static: "static-kr",
    },
    region: "kr",
  },
  warcraftLogs: {
    clientId: process.env.WARCRAFT_LOGS_CLIENT_ID ?? "",
    clientSecret: process.env.WARCRAFT_LOGS_CLIENT_SECRET ?? "",
  },
} satisfies Record<string, unknown>
