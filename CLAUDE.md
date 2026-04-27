@AGENTS.md

# WoW Raid Builder — Claude 지침

공대장(길드/막공)을 위한 공대 구성 분석 서비스. Blizzard API + Raider.IO + WCL로 캐릭터 데이터 자동 수집, 버프/유틸 커버리지 시각화.

---

## 코딩 규칙 (반드시 준수)

1. **줄임말 금지** — 모든 변수·함수·타입·파라미터에 줄임말 사용 금지.
   `pct→percent`, `avg→average`, `req→request`, `idx→index`, `r→ranking`, `c→character`
   예외: `ref`(React API), `props`, `params`(Next.js), `event`

2. **WCL 로그 표현** — UI·코드 모두 `parse` 대신 `log` 사용.
   `parseColorClass→logColorClass`, `ParseCell→LogCell`, `ParseVariant→LogVariant`

3. **컴포넌트 코드 순서**
   `스토어·useState·useRef·커스텀훅` → `핸들러 함수` → `useEffect` → `return JSX`

4. **상수·타입·유틸 분리 (FSD)** — 컴포넌트에 있을 필요 없는 것은 분리.
   표시용 상수→`feature/config/`, 도메인 유틸→`feature/lib/`, 범용 유틸→`shared/lib/`
   파일명은 도메인명 사용 (❌`utils.ts` / ✅`log-color.ts`)
   **예외**: 해당 컴포넌트 전용 Props 인터페이스(`interface XxxProps`)는 컴포넌트 파일 내부에 둔다.

5. **lodash-es 우선** — debounce·타입 체킹은 직접 구현 금지, `lodash-es` 사용.
   tree-shaking을 위해 `lodash` 아닌 `lodash-es`. (`isNumber`, `isArray`, `isPlainObject` 등)

6. **코드 중복 금지** — 동일 값·로직 2곳 이상 반복 시 공통 위치로 추출.
   API Base URL→`shared/config/<서비스>.ts`, 공통 타입→`entities/<도메인>/model/`

7. **FSD import 방향** — `app→pages→widgets→features→entities→shared`.
   같은 레이어 간 cross-import 금지. 슬라이스는 `index.ts`로만 노출.

---

## 작업 규칙

- 작업 완료 후: `pnpm build` 통과 → `git add -A && git commit && git push origin develop`
- **브랜치**: `develop`에서 작업, `main`은 PR로만
- **백그라운드 서버 실행 금지** — 사용자가 직접 `pnpm dev`

---

## 기술 스택

| 역할       | 선택                                   |
| ---------- | -------------------------------------- |
| 프레임워크 | Next.js 16 (App Router, Turbopack)     |
| 상태       | TanStack Query v5 + Zustand v5 persist |
| 폼         | React Hook Form + Zod                  |
| HTTP       | Axios (인스턴스 + interceptor)         |
| UI         | Tailwind CSS v4 + shadcn + warcraftcn  |
| 유틸       | lodash-es                              |
| 호스팅     | Vercel                                 |

---

## FSD 구조 (`src/`)

```
app/api/                     ← Route Handlers (Secret 보호 — 클라이언트 직접 호출 금지)
entities/character/          ← buffs.ts, queries.ts, types.ts
features/character-search/   ← Combobox 자동완성 (useDebounce 350ms)
features/roster-manager/     ← RosterList, BuffAnalysis, useRosterSync
  config/roster-display.ts   ← ROLE_LABEL, ROLE_COLOR, ROLE_SORT_ORDER
  lib/log-color.ts           ← LogVariant, logColorClass, logVariant
shared/api/                  ← apiClient, blizzardClient
shared/config/               ← realms.ts, class-colors.ts, season.ts, raiderio.ts
shared/lib/                  ← use-debounce.ts, roster-url.ts, wcl-token.ts
shared/model/                ← roster-store.ts (Zustand persist)
```

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
- 사용 데이터: `zoneRankings.bestPerformanceAverage` (로그 % 평균)
- 로그 % 색상: 95+골드(legendary), 75+보라(epic), 50+파랑(rare), 25+초록, 미만 회색

### 시즌 상수 — `shared/config/season.ts` 한 파일만 수정

```ts
CURRENT_SEASON = "season-mn-1" // Raider.IO (Midnight S1)
CURRENT_WCL_ZONE_ID = 46 // WCL (VS/DR/MQD, Midnight S1 raid)
```

확인: Raider.IO `GET /mythic-plus/seasons?region=kr` / WCL GraphQL `worldData { zones }`

---

## 로컬 개발

```bash
# SSL 인증서 이슈 (macOS) — pnpm dev 스크립트에 이미 포함됨
NODE_EXTRA_CA_CERTS=$(pwd)/.certs.pem next dev
# .certs.pem 없으면: security find-certificate -a -p /Library/Keychains/System.keychain > .certs.pem
```

`.certs.pem`은 `.gitignore` 등록됨. `NODE_EXTRA_CA_CERTS`는 스크립트에서 설정 (TLS 초기화 전 필요).

---

## Known Gotchas

| 문제                      | 원인                                | 해결                                 |
| ------------------------- | ----------------------------------- | ------------------------------------ |
| CSS `@import` 오류        | 다른 규칙 뒤에 위치                 | 파일 최상단에 배치                   |
| Combobox z-index 무효     | `backdrop-blur-sm` stacking context | 검색 섹션에서 제거                   |
| warcraftcn CSS asset 오류 | 미설치 컴포넌트 로컬 경로           | CDN URL로 교체                       |
| CSS `@/` alias 불가       | Turbopack 미지원                    | 상대경로 사용                        |
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
