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

| 역할       | 선택                                   |
| ---------- | -------------------------------------- |
| 프레임워크 | Next.js 16 (App Router, Turbopack)     |
| 상태       | TanStack Query v5 + Zustand v5 persist |
| 폼         | React Hook Form + Zod                  |
| HTTP       | Axios (인스턴스 + interceptor)         |
| UI         | Tailwind CSS v4 + shadcn + warcraftcn  |
| 유틸       | lodash-es, sonner(toast)               |
| 호스팅     | Vercel                                 |

---

## FSD 구조 (`src/`)

```
app/api/                     ← Route Handlers (Secret 보호 — 클라이언트 직접 호출 금지)
entities/character/          ← buffs.ts, queries.ts, types.ts, api.ts
features/character-search/   ← Combobox 자동완성 (useDebounce 350ms)
features/roster-manager/     ← RosterList, BuffAnalysis, useRosterSync
  config/roster-display.ts   ← ROLE_LABEL, ROLE_COLOR, ROLE_SORT_ORDER
  lib/log-color.ts           ← LogVariant, logColorClass, logVariant
  lib/fetch-character.ts     ← 캐릭터 데이터 병렬 fetch
shared/api/                  ← apiClient, blizzardClient
shared/config/               ← realms.ts, class-colors.ts, season.ts, raiderio.ts
shared/lib/                  ← use-debounce.ts, roster-url.ts, wcl-zone-rankings.ts
shared/model/                ← roster-store.ts (Zustand persist, MAX_ROSTER_SIZE=30)
```

### RosterCharacter 주요 필드

```ts
{ id, name, realm, faction: "alliance"|"horde", classId, className, specId, specName,
  role, itemLevel, raiderIO, warcraftLogs }
```

### 버프/유틸 커버리지 (`entities/character/buffs.ts`)

- **한밤(Midnight) 기준**. 각 `BuffSource`에 `spellId` + `icon` 포함.
- 아이콘: `wowheadIconUrl(icon)` → `https://wow.zamimg.com/images/wow/icons/medium/{icon}.jpg`
- 카테고리: `"블러드" | "전투부활" | "시너지" | "외생기" | "공생기" | "유틸"`
- `COUNTABLE_CATEGORIES`: 모든 카테고리 개수 표시
- 시너지 그룹: 적 디버프 / 아군 스탯버프 / 오라
- 외생기 그룹: 피해 감소·면역 / 생존·응급 치유 / 마나·가속 강화
- 공생기 그룹: 마법 피해 방어 / 체력·생존 강화
- 유틸 그룹: 끌어당기기 / 이동·위치 / 아이템·소환·디버프
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
CURRENT_WCL_ZONE_ID = 46 // WCL (Midnight S1 raid)
```

---

## 로컬 개발

```bash
# SSL 인증서 이슈 (macOS) — pnpm dev 스크립트에 이미 포함됨
NODE_EXTRA_CA_CERTS=$(pwd)/.certs.pem next dev
```

`.certs.pem`은 `.gitignore` 등록됨.

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
