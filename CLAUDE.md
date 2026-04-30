@AGENTS.md

# WoW Raid Builder — Claude 지침

공대장을 위한 공격대 구성 분석 서비스. Blizzard API + Raider.IO + WCL로 캐릭터 데이터 자동 수집, 버프/유틸 커버리지 시각화.

---

## 코딩 규칙 (반드시 준수)

1. **줄임말 금지** — 변수·함수·타입·파라미터 모두. `pct→percent`, `avg→average`, `idx→index`, `c→character`
   예외: `ref`(React), `props`, `params`(Next.js)

2. **WCL 표현** — UI·코드 모두 `parse` 대신 `log`. `parseColorClass→logColorClass`

3. **컴포넌트 코드 순서** — `스토어·상태·ref·커스텀훅` → `핸들러 함수` → `useEffect` → `return JSX`

4. **상수·타입·유틸 분리 (FSD)** — 컴포넌트 밖으로 분리.
   표시용 상수→`feature/config/`, 도메인 유틸→`feature/lib/`, 범용→`shared/lib/`
   파일명은 도메인명 (❌`utils.ts` / ✅`log-color.ts`)
   **예외**: 컴포넌트 전용 `interface XxxProps`는 컴포넌트 파일 내부에 둔다.

5. **lodash-es 우선** — debounce·타입 체킹은 직접 구현 금지. tree-shaking을 위해 `lodash` 아닌 `lodash-es`.

6. **중복 금지** — 동일 값·로직 2곳 이상 반복 시 공통 위치로 추출.

7. **FSD import 방향** — `app→features→entities→shared`. 같은 레이어 cross-import 금지. 슬라이스는 `index.ts`로만 노출.

---

## 작업 규칙

- 작업 완료 후: `pnpm build` 통과 → `git add -A && git commit && git push origin develop`
- **브랜치**: `develop` 작업, `main`은 PR로만
- **백그라운드 서버 실행 금지** — 사용자가 직접 `pnpm dev`

---

## 기술 스택

| 역할   | 선택                                                              |
| ------ | ----------------------------------------------------------------- |
| 프레임 | Next.js 16 (App Router, Turbopack)                                |
| 상태   | TanStack Query v5 (`@lukemorales/query-key-factory`) + Zustand v5 |
| 폼     | React Hook Form v7 + Zod v4                                       |
| HTTP   | Axios (인스턴스 + interceptor)                                    |
| UI     | Tailwind CSS v4 + shadcn/ui + warcraftcn                          |
| 유틸   | lodash-es, sonner(toast)                                          |
| 호스팅 | Vercel                                                            |

---

## FSD 구조 (`src/`)

```
app/
  api/character/[realm]/[name]/   ← Blizzard 캐릭터 (Route Handler)
  api/character/search/           ← 캐릭터 검색 자동완성
  api/raiderio/[realm]/[name]/    ← Raider.IO 프록시
  api/warcraftlogs/[realm]/[name]/← WCL 프록시
  layout.tsx / page.tsx / globals.css

entities/character/
  api.ts          ← fetch 함수
  buffs.ts        ← 버프/유틸 정의 (한밤 기준)
  config/
    spec-role.ts  ← 스펙ID→역할 매핑
  queries.ts      ← TanStack Query 훅
  types.ts        ← RosterCharacter, BuffSource 등
  index.ts        ← public API

features/character-search/
  schema.ts                       ← Zod 검색 스키마
  ui/CharacterSearchForm.tsx      ← Combobox (useDebounce 350ms)
  index.ts

features/roster-manager/
  config/roster-display.ts        ← ROLE_LABEL, ROLE_COLOR, ROLE_SORT_ORDER
  lib/fetch-character.ts          ← 캐릭터 데이터 병렬 fetch
  lib/log-color.ts                ← LogVariant, logColorClass, logVariant
  lib/sort-roster.ts              ← 로스터 정렬 로직
  model/useRosterSync.ts          ← URL ↔ 스토어 동기화 훅
  ui/BuffAnalysis.tsx
  ui/RosterList.tsx
  ui/RosterUrlLoader.tsx
  index.ts

shared/
  api/
    axios.ts           ← apiClient (Raider.IO·WCL용)
    blizzard-client.ts ← blizzardClient (OAuth interceptor)
  config/
    class-colors.ts    ← 클래스 색상 맵
    env.ts             ← 서버 환경변수 검증
    raiderio.ts        ← Raider.IO Base URL
    realms.ts          ← 한→영 realm slug 매핑
    season.ts          ← CURRENT_SEASON, CURRENT_WCL_ZONE_ID (시즌 변경 시 이 파일만)
    warcraftlogs.ts    ← WCL 엔드포인트
  lib/
    api-error.ts       ← API 에러 처리
    blizzard-fetch.ts  ← Blizzard fetch 헬퍼
    blizzard-token.ts  ← OAuth 토큰 캐시
    query-client.ts    ← QueryClient 설정
    query-keys.ts      ← query-key-factory 정의
    query-provider.tsx ← QueryClientProvider
    roster-url.ts      ← 로스터 URL 인코딩/디코딩
    theme-provider.tsx ← 다크모드 Provider
    use-debounce.ts
    wcl-token.ts       ← WCL OAuth 토큰 캐시
    wcl-zone-rankings.ts
  model/
    roster-store.ts    ← Zustand persist (MAX_ROSTER_SIZE=30)
  types/
    blizzard.ts        ← Blizzard API 응답 타입
  ui/
    AppToaster.tsx     ← sonner Toaster
    ThemeToggle.tsx

# FSD 외 — shadcn/ui 컨벤션 유지
components/ui/        ← shadcn 컴포넌트 + warcraftcn
lib/utils.ts          ← cn() (tailwind-merge)
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
- `COUNTABLE_CATEGORIES`: 모든 카테고리 개수 표시
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

### 시즌 상수 — `shared/config/season.ts` 한 파일만 수정

```ts
CURRENT_SEASON = "season-mn-1" // Raider.IO (Midnight S1)
CURRENT_WCL_ZONE_ID = 46 // WCL Zone (Midnight S1 raid)
CURRENT_RAID_NAME = "VS / DR / MQD"
```

---

## Known Gotchas

| 문제                      | 원인                                | 해결                                 |
| ------------------------- | ----------------------------------- | ------------------------------------ |
| CSS `@import` 오류        | 다른 규칙 뒤에 위치                 | 파일 최상단에 배치                   |
| Combobox z-index 무효     | `backdrop-blur-sm` stacking context | 검색 섹션에서 제거                   |
| warcraftcn CSS asset 오류 | 미설치 컴포넌트 로컬 경로           | CDN URL로 교체                       |
| 한글 검색 빈 배열         | axios params 한글 인코딩 깨짐       | URL 직접 구성 + `encodeURIComponent` |

---

## 환경변수

```bash
BLIZZARD_CLIENT_ID=
BLIZZARD_CLIENT_SECRET=
WARCRAFT_LOGS_CLIENT_ID=
WARCRAFT_LOGS_CLIENT_SECRET=
```

GitHub Actions Secrets에도 동일하게 등록 필요.
