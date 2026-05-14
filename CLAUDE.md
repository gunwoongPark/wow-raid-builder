@AGENTS.md

# Raid Scope — Claude 지침

공대장을 위한 공격대 구성 분석 서비스. Blizzard API + Raider.IO + WCL로 캐릭터 데이터 자동 수집, 버프/유틸 커버리지 시각화, 파티 프레임 편성.

---

## 코딩 규칙 (반드시 준수)

1. **줄임말 금지** — `pct→percent`, `avg→average`, `idx→index`, `c→character`. 예외: `ref`, `props`, `params`
2. **WCL 표현** — UI·코드 모두 `parse` 대신 `log`. `parseColorClass→logColorClass`
3. **컴포넌트 코드 순서** — `스토어·상태·ref·커스텀훅` → `핸들러 함수` → `useEffect` → `return JSX`
4. **상수·타입·유틸 분리 (FSD)** — 표시용 상수→`feature/config/`, 도메인 유틸→`feature/lib/`, 범용→`shared/lib/`. 파일명은 도메인명 (❌`utils.ts` / ✅`log-color.ts`). 예외: `interface XxxProps`는 컴포넌트 파일 내부.
5. **lodash-es 우선** — debounce·타입 체킹 직접 구현 금지. tree-shaking을 위해 `lodash` 아닌 `lodash-es`.
6. **중복 금지** — 동일 값·로직 2곳 이상 반복 시 공통 위치로 추출.
7. **FSD import 방향** — `app→features→entities→shared`. 같은 레이어 cross-import 금지. 슬라이스는 `index.ts`로만 노출. 단, 서버 전용 함수는 `index.ts` 우회 가능 (주석 명시).

---

## 작업 규칙

- 작업 완료 후: `pnpm build` 통과 → `git add -A && git commit && git push origin develop`
- **브랜치**: `develop` 작업, `main`은 PR로만 (Vercel은 main 브랜치만 프로덕션 배포)
- **백그라운드 서버 실행 금지** — 사용자가 직접 `pnpm dev`

---

## 기술 스택

| 역할   | 선택                                                              |
| ------ | ----------------------------------------------------------------- |
| 프레임 | Next.js 16 (App Router, Turbopack, React Compiler)                |
| 상태   | TanStack Query v5 (`@lukemorales/query-key-factory`) + Zustand v5 |
| 폼     | React Hook Form v7 + Zod v4                                       |
| HTTP   | Axios (인스턴스 + interceptor)                                    |
| UI     | Tailwind CSS v4 + shadcn/ui + warcraftcn                          |
| 다국어 | next-intl v4 (ko/en, 국가 기반 자동 감지)                         |
| 유틸   | lodash-es, sonner(toast)                                          |
| 호스팅 | Vercel (Analytics + Speed Insights 포함)                          |

---

## FSD 구조 (`src/`)

```
proxy.ts            ← Next.js 16 미들웨어 (middleware.ts 대체). 국가 기반 로케일 감지
                      x-vercel-ip-country: KR→ko, 그 외→en. 쿠키(NEXT_LOCALE) 1년 유지

i18n/
  routing.ts        ← locales: ["ko","en"], defaultLocale:"ko", localePrefix:"as-needed"
  request.ts        ← getRequestConfig, messages/${locale}.json 로드
  navigation.ts     ← createNavigation (Link, useRouter, usePathname, redirect)

app/
  layout.tsx                      ← root layout (html 태그, 폰트 없음)
  [locale]/layout.tsx             ← 로케일별 레이아웃 (NextIntlClientProvider, QueryProvider 등)
  [locale]/page.tsx               ← 메인 페이지 (SSR: URL r= 파라미터로 초기 로스터 로드)
                                    URL queryString 파라미터:
                                      r=   로스터 공유 링크 (캐릭터 목록 인코딩)
                                      sort= 정렬 컬럼, dir= 정렬 방향 (asc/desc)
                                      view= 뷰 모드 ("party" | 없으면 "list")
  [locale]/error.tsx / not-found.tsx
  global-error.tsx
  api/character/[realm]/[name]/   ← Blizzard 캐릭터 Route Handler
  api/character/search/           ← 캐릭터 검색 자동완성
  api/raiderio/[realm]/[name]/    ← Raider.IO 프록시
  api/warcraftlogs/[realm]/[name]/← WCL 프록시
  apple-icon.tsx / icon.tsx       ← ImageResponse 아이콘
  opengraph-image.tsx             ← OG 이미지 (한글 텍스트 금지 — Edge font 미지원)
  manifest.ts / robots.ts / sitemap.ts

entities/character/
  api.ts              ← fetch 함수, buildRaiderIOProfile, getEnglishClassAndSpec
  buffs.ts            ← 버프/유틸 정의 (한밤 기준), analyzeBuffCoverage
  config/spec-role.ts ← SPEC_ROLE_MAP (스펙ID→역할)
  lib/
    buff-recommendations.ts ← getBuffRecommendations (시너지 우선)
    character-urls.ts       ← buildCharacterUrls (armory·WCL 링크), getFirstRaidProgression
    roster-url.ts           ← URL 인코딩/디코딩, extractRealmSlug
    wcl-zone-rankings.ts    ← ZONE_RANKINGS_QUERY, parseZoneRankings
  model/roster-store.ts ← Zustand persist (MAX_ROSTER_SIZE=30)
  queries.ts / types.ts / index.ts

features/character-search/
  ui/CharacterSearchForm.tsx  ← Combobox (useDebounce 250ms)
  index.ts

features/roster-manager/
  config/
    buff-display.ts     ← CATEGORY_LABEL, INLINE_CATEGORIES
    dnd.ts              ← DND_IDS (파티 드래그앤드롭 식별자)
    party.ts            ← MAX_PARTY_SIZE=5, PARTY_COUNT=6
    roster-display.ts   ← ROLE_LABEL, ROLE_COLOR, ROLE_SORT_ORDER
    table-columns.ts    ← HEADER_COLUMNS
  lib/
    auto-assign-parties.ts      ← 역할 균형 라운드 로빈 파티 자동 배정
    fetch-character.ts          ← 클라이언트용 캐릭터 fetch (TanStack Query)
    fetch-character-server.ts   ← 서버용 캐릭터 fetch (SSR 링크 공유)
    log-color.ts / score-color.ts / sort-roster.ts / roster-stats.ts
  model/
    preset-store.ts   ← 로스터 프리셋 Zustand persist
    useRosterSync.ts  ← URL ↔ 스토어 동기화 훅
  ui/
    BuffAnalysis.tsx / BuffCard.tsx / BuffRecommendations.tsx
    CharacterRow.tsx / LogCell.tsx / PresetManager.tsx
    PartyCard.tsx / PartyFrameView.tsx   ← 파티 프레임 (드래그앤드롭)
    ProviderBadge.tsx / RosterInitializer.tsx / RosterList.tsx
    RosterUrlLoader.tsx / RosterViewToggle.tsx
    ScoreCell.tsx / SortIcon.tsx / SortableHeaderCell.tsx
  index.ts

shared/
  api/    axios.ts · blizzard-client.ts
  config/ cache-headers.ts · class-colors.ts · env.ts · raiderio.ts
          realms.ts · season.ts · site.ts · warcraftlogs.ts
  lib/    api-error.ts · blizzard-fetch.ts · blizzard-token.ts
          create-token-cache.ts   ← Blizzard/WCL OAuth 토큰 캐시 공통 팩토리
          query-client.ts · query-keys.ts · query-provider.tsx
          route-param-schema.ts   ← Route Handler 파라미터 Zod 검증
          theme-provider.tsx · use-debounce.ts · use-is-dark-mode.ts · wcl-token.ts
  types/  blizzard.ts
  ui/     AppFooter.tsx · AppToaster.tsx · LanguageSwitcher.tsx
          NetworkStatusMonitor.tsx · ThemeToggle.tsx

# FSD 외 — shadcn/ui 컨벤션 유지
components/ui/  ← shadcn + warcraftcn (wow-btn 등 CSS 클래스 포함)
lib/utils.ts    ← cn() (tailwind-merge)

messages/
  ko.json / en.json  ← 모든 UI 문자열. 새 문자열 추가 시 두 파일 동시 수정
```

### RosterCharacter 주요 필드

```ts
{ id, name, realm, faction: "alliance" | "horde",
  classId, className, specId, specName,
  role, itemLevel, raiderIO, warcraftLogs }
```

### 버프/유틸 (`entities/character/buffs.ts`)

- **한밤(Midnight) 기준**. 각 `BuffSource`에 `spellId` + `icon` 포함.
- 아이콘: `wowheadIconUrl(icon)` → `https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg`
- 카테고리: `"블러드" | "전투부활" | "시너지" | "외생기" | "공생기" | "유틸"`
- 클래스/특성명은 한국 WoW 공식 명칭 사용 (팔라딘❌→성기사✅, 안개술사❌→운무 수도사✅)

---

## 외부 API

### Blizzard

- OAuth Client Credentials → `https://kr.battle.net/oauth/token`
- Base URL: `https://kr.api.blizzard.com` / Namespace: `profile-kr / static-kr`
- interceptor: 토큰 주입 + 401 → invalidate → 재시도 1회
- realm은 반드시 영문 slug — `shared/config/realms.ts` 참조

### Raider.IO

- 공개 API, 키 불필요. Base URL: `shared/config/raiderio.ts`
- **한글 이름**: `axios params` 금지 → URL 직접 구성 (`encodeURIComponent`)

### Warcraft Logs

- GraphQL: `https://www.warcraftlogs.com/api/v2/client`
- 환경변수: `WARCRAFT_LOGS_CLIENT_ID`, `WARCRAFT_LOGS_CLIENT_SECRET` (미설정 시 null, graceful)
- 로그 % 색상: 95+골드(legendary), 75+보라(epic), 50+파랑(rare), 25+초록, 미만 회색

### Cache Headers — `shared/config/cache-headers.ts`

```ts
CHARACTER_SUMMARY: "public, max-age=300, stale-while-revalidate=600"
RAIDERIO_PROFILE: "public, max-age=300, stale-while-revalidate=600"
WCL_DATA: "public, max-age=600, stale-while-revalidate=1200"
```

### 시즌 상수 — `shared/config/season.ts` 한 파일만 수정

```ts
CURRENT_SEASON = "season-mn-1" // Raider.IO (Midnight S1)
CURRENT_WCL_ZONE_ID = 46 // WCL Zone (Midnight S1 raid)
CURRENT_RAID_NAME = "VS / DR / MQD"
```

---

## Known Gotchas

| 문제                          | 원인                                | 해결                                                |
| ----------------------------- | ----------------------------------- | --------------------------------------------------- |
| CSS `@import` 오류            | 다른 규칙 뒤에 위치                 | 파일 최상단에 배치                                  |
| Combobox z-index 무효         | `backdrop-blur-sm` stacking context | 검색 섹션에서 제거                                  |
| 한글 검색 빈 배열             | axios params 한글 인코딩 깨짐       | URL 직접 구성 + `encodeURIComponent`                |
| OG 이미지 한글 렌더링 실패    | Edge Runtime Dynamic font 미지원    | opengraph-image.tsx에 한글 텍스트 금지              |
| 라이트 모드 색상 저대비       | 다크 전용 oklch/opacity 값          | `dark:` prefix 분리, light용 별도 지정              |
| Next.js 16 미들웨어 파일명    | `middleware.ts` 미인식              | `proxy.ts`가 미들웨어 진입점 (Next.js 16 변경사항)  |
| 언어 수동 전환 후 재방문 복귀 | 쿠키 미갱신                         | `LanguageSwitcher`에서 `NEXT_LOCALE` 쿠키 직접 갱신 |

---

## 환경변수

```bash
NEXT_PUBLIC_BASE_URL=            # 배포 URL (SEO canonical, OG). 기본값: https://raid-scope.vercel.app
BLIZZARD_CLIENT_ID=
BLIZZARD_CLIENT_SECRET=
WARCRAFT_LOGS_CLIENT_ID=
WARCRAFT_LOGS_CLIENT_SECRET=
```

GitHub Actions Secrets에도 동일하게 등록 필요.
