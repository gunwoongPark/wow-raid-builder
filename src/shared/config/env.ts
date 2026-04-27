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
} satisfies Record<string, unknown>
