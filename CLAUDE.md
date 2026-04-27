@AGENTS.md

# WoW Raid Builder — Claude 지침

## 프로젝트

공대장(길드/막공)을 위한 공대 구성 분석 서비스. Blizzard API + Raider.IO로 캐릭터 데이터 자동 수집, 버프/유틸 커버리지 시각화.

---

## 작업 규칙

```
작업 완료 후 반드시:
1. npm run build  → 통과 확인
2. git add -A && git commit -m "..." && git push origin develop
```

- **브랜치**: `develop`에서 작업, `main`은 PR로만
- **백그라운드 서버 실행 금지** — 사용자가 직접 `pnpm dev`
- 의미 있는 단위마다 주기적으로 커밋 & 푸시

---

## 기술 스택

| 역할       | 선택                                          |
| ---------- | --------------------------------------------- |
| 프레임워크 | Next.js 16 (App Router, Turbopack)            |
| 상태       | TanStack Query v5 + Zustand v5 persist        |
| 폼         | React Hook Form + Zod                         |
| HTTP       | Axios (인스턴스 + interceptor)                |
| UI         | Tailwind CSS v4 + shadcn + warcraftcn         |
| 테마       | next-themes (dark/light/system, 기본: system) |
| 호스팅     | Vercel + Neon PostgreSQL (예정)               |

---

## FSD 구조 (`src/`)

```
app/api/          ← Route Handlers (Blizzard Secret 보호 — 클라이언트 직접 호출 금지)
entities/character/   buffs.ts, queries.ts, types.ts
entities/guild/
features/character-search/   Combobox 자동완성 (debounce 350ms)
features/roster-manager/     RosterList + BuffAnalysis
shared/api/       apiClient (/api 프록시), blizzardClient (interceptor)
shared/config/    realms.ts (KR slug 매핑), class-colors.ts (직업 색상)
shared/lib/       blizzard-token.ts, query-keys.ts, theme-provider.tsx
shared/model/     roster-store.ts (Zustand persist)
```

---

## 외부 API

### Blizzard API

- **인증**: Client Credentials OAuth → `https://kr.battle.net/oauth/token`
- **Base URL**: `https://kr.api.blizzard.com`, Namespace: `profile-kr / static-kr / dynamic-kr`
- **Locale**: `ko_KR`
- **interceptor**: request(토큰 주입) + response(401 → invalidate → 재시도 1회)
- **realm 파라미터**: 반드시 영문 slug (`줄진` → `zuljin`) — `shared/config/realms.ts` 참조
- **길드 로스터**: 특성화(spec) 미포함 → 멤버별 개별 캐릭터 호출 필요 (N+1 주의)

### Raider.IO API

- 공개 API, 키 불필요
- **한글 이름 전달 시**: `axios params` 객체 사용 금지 → URL 직접 구성 (`encodeURIComponent`)
  ```ts
  // ❌ 깨짐: axios.get(url, { params: { name: "액흑" } })
  // ✅ 정상: axios.get(`${url}?name=${encodeURIComponent(name)}&...`)
  ```
- 현재 시즌 상수: `CURRENT_SEASON = "season-tww-2"` (시즌 변경 시 수정)
- 제공 데이터: M+ 점수, 레이드 진행도 (파싱 퍼센타일은 Warcraft Logs 영역)

### Warcraft Logs API

- GraphQL: `https://www.warcraftlogs.com/api/v2/client`
- Client Credentials OAuth (등록: warcraftlogs.com/api/clients)
- **환경변수**: `WARCRAFT_LOGS_CLIENT_ID`, `WARCRAFT_LOGS_CLIENT_SECRET` (미설정 시 null 반환, graceful)
- **토큰 관리**: `shared/lib/wcl-token.ts` (blizzard-token.ts 동일 패턴)
- **Route Handler**: `app/api/warcraftlogs/[realm]/[name]/route.ts`
- **현재 레이드 Zone ID**: `CURRENT_ZONE_ID = 43` (Liberation of Undermine, TWW S2) — 시즌 변경 시 수정
- **사용 데이터**: `zoneRankings.bestPerformanceAverage` (파싱 % 평균), `medianPerformanceAverage`
- **RosterList 파싱 % 색상**: 95+ 골드(legendary), 75+ 보라(epic), 50+ 파랑(rare), 25+ 초록, 25미만 회색

---

## 로컬 개발 환경

```bash
# SSL 인증서 이슈 (macOS) — pnpm dev 스크립트에 이미 포함됨
NODE_EXTRA_CA_CERTS=$(pwd)/.certs.pem next dev
# .certs.pem 없으면: security find-certificate -a -p /Library/Keychains/System.keychain > .certs.pem
```

- `.certs.pem` → `.gitignore` 등록됨 (커밋 금지)
- `NODE_EXTRA_CA_CERTS`는 `.env.local`이 아닌 스크립트에서 설정해야 함 (TLS 초기화 전 필요)

---

## 주요 함정 (Known Gotchas)

| 문제                           | 원인                                       | 해결                                                 |
| ------------------------------ | ------------------------------------------ | ---------------------------------------------------- |
| CSS `@import` 파싱 오류        | 다른 규칙 뒤에 `@import` 위치              | `@import`를 파일 최상단에 배치                       |
| Combobox 드롭다운 z-index 무효 | `backdrop-blur-sm`이 stacking context 생성 | 검색 섹션에서 `backdrop-blur` 제거                   |
| warcraftcn CSS asset 오류      | 미설치 컴포넌트의 로컬 경로 참조           | CDN URL로 교체 (`url("https://warcraftcn.com/...")`) |
| CSS `@/` alias 불가            | Turbopack이 CSS에서 `@/` 미지원            | 상대경로 사용 (`../components/...`)                  |
| 한글 검색 빈 배열              | axios params 직렬화 시 한글 인코딩 깨짐    | URL 직접 구성 + `encodeURIComponent`                 |

---

## 버프 분석 (`entities/character/buffs.ts`)

- 스펙 ID 기반 정적 매핑 (Blizzard API는 버프 의미론적 분류 미제공)
- `COUNTABLE_CATEGORIES`: 시너지 제외 카테고리는 공급자 수(×N) 표시
- 스펙 ID 검증: `GET /data/wow/playable-specialization/index` (Namespace: static-kr)

---

## 환경변수

```bash
BLIZZARD_CLIENT_ID=        # develop.battle.net
BLIZZARD_CLIENT_SECRET=
```

GitHub Actions Secrets에도 동일하게 등록 필요.
