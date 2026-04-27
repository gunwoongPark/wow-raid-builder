@AGENTS.md

# WoW Raid Builder — 프로젝트 지침

## 프로젝트 개요

공격대장(길드 공대장 + 막공 공대장)이 공대 구성을 효율적으로 짤 수 있도록 돕는 웹 서비스.

**핵심 차별점**: Blizzard 공식 API + Raider.IO API를 통해 캐릭터 데이터를 자동 수집하고,
버프/유틸 커버리지를 분석해 한눈에 부족한 직업을 파악할 수 있게 한다.

---

## 타겟 유저

| 유저        | 흐름                                                       |
| ----------- | ---------------------------------------------------------- |
| 길드 공대장 | 길드명 입력 → 길드원 일괄 불러오기 → 공대 인원 선택 → 분석 |
| 막공 공대장 | 캐릭터명 검색으로 한 명씩 추가 → 분석                      |

두 경로 모두 **같은 로스터 store**를 거쳐 동일한 분석 로직에 도달한다.

---

## 핵심 MVP 기능

### 1. 로스터 구성

- 캐릭터명 + 서버명으로 개별 검색해 로스터에 추가
- 길드명으로 일괄 불러오기 후 선택 추가
- 로스터는 Zustand persist로 브라우저 새로고침 후에도 유지

### 2. 버프 / 유틸 커버리지 분석 (핵심)

로스터 기반으로 아래 카테고리를 분석해 커버된 항목과 누락된 항목을 시각화:

- **핵심**: 영웅심/시간왜곡/고대의 격노, 전투 부활
- **시너지**: 흑요석 힘(증폭술사), 자연의 표시(드루이드), 비전의 총명함(법사), 신비로운 손길(수도사), 사냥꾼 표식
- **오라**: 헌신의 오라(신기), 징벌의 오라(징벌), 십자군 오라(보호)
- **힐러 외생기**: 정령 인도(복술), 활력 주입(사제), 내면의 힘(드루이드), 희생의 축복(팔라딘)
- **공대 쿨기**: 권능의 방어막(수양), 어둠(악마사냥꾼), 마법 차단 구역(죽기), 집결의 함성(전사), 오라 숙련(신기)
- **유틸**: 우렁찬 포효(드루이드), 질풍의 토템(주술사), 집단 포탈(법사), 영혼석·소울스톤(흑마법사)

버프 매핑은 `src/entities/character/buffs.ts` — 스펙 ID 기반 정적 매핑
(Blizzard API는 버프 의미론적 분류를 제공하지 않으므로 직접 인코딩)

### 3. 공대원 상세 정보

캐릭터 추가 시 Blizzard API + Raider.IO API 병렬 조회:

| 정보                              | 출처                                     | 비고                             |
| --------------------------------- | ---------------------------------------- | -------------------------------- |
| 직업, 특성, 역할(탱/힐/딜)        | Blizzard Character Profile API           | 스펙 ID → 역할 매핑은 `buffs.ts` |
| 장착 아이템레벨                   | Blizzard Character Profile API           | `equipped_item_level` 필드       |
| M+ 점수 (시즌별 전체/역할별)      | Raider.IO `mythic_plus_scores_by_season` | 현재 시즌: `season-tww-2`        |
| 레이드 진행도 (영웅/신화 보스 킬) | Raider.IO `raid_progression`             | summary 문자열 + 킬 수           |

> **파싱 점수(퍼센타일)**는 Warcraft Logs API 영역. Raider.IO는 진행도와 M+ 점수만 제공.
> Warcraft Logs 연동은 MVP 이후 별도 고려.

---

## 기술 스택

| 역할            | 선택                                               |
| --------------- | -------------------------------------------------- |
| 프레임워크      | Next.js 16 (App Router)                            |
| 언어            | TypeScript (strict)                                |
| 서버 상태       | TanStack Query v5 + @lukemorales/query-key-factory |
| 클라이언트 상태 | Zustand v5 (persist)                               |
| 폼              | React Hook Form + Zod                              |
| HTTP            | Axios (인스턴스 + interceptor)                     |
| 스타일          | Tailwind CSS v4                                    |
| DB              | Neon PostgreSQL + Drizzle ORM (예정)               |
| 호스팅          | Vercel                                             |

---

## 아키텍처

### FSD 레이어 구조 (`src/`)

```
app/
├── api/                                        ← Route Handlers — 반드시 서버 전용
│   ├── character/[realm]/[name]/route.ts       ← Blizzard 캐릭터 프로필
│   ├── guild/[realm]/[guildName]/members/      ← Blizzard 길드 멤버 로스터
│   └── raiderio/[realm]/[name]/route.ts        ← Raider.IO 프록시
├── layout.tsx
└── page.tsx

entities/
├── character/
│   ├── buffs.ts      ← 스펙 ID → 버프 카테고리 매핑 (핵심 도메인 지식)
│   ├── queries.ts    ← query-key-factory 기반 queryOptions
│   └── types.ts      ← RosterCharacter, RaiderIOProfile 등
└── guild/

features/
├── character-search/   ← 개별 캐릭터 검색·추가 폼
├── guild-search/       ← 길드 일괄 불러오기 폼
└── roster-manager/     ← 로스터 목록 + 버프 커버리지 분석 UI

shared/
├── api/
│   ├── axios.ts              ← apiClient (/api 프록시, 클라이언트 전용)
│   └── blizzard-client.ts    ← blizzardClient (서버 전용, interceptor 포함)
├── config/env.ts             ← 환경변수
├── lib/
│   ├── blizzard-fetch.ts     ← namespace 헤더 처리 래퍼
│   ├── blizzard-token.ts     ← 토큰 캐싱 + inflight 중복 방지 + invalidate
│   ├── query-keys.ts         ← mergeQueryKeys(guildKeys, characterKeys)
│   └── query-provider.tsx
├── model/
│   └── roster-store.ts       ← 로스터 Zustand store (persist)
└── types/blizzard.ts
```

### FSD 레이어 규칙

- 각 슬라이스는 `index.ts`를 통해서만 외부에 노출. 내부 파일 직접 import 금지.
- `entities` → `shared`만 참조 가능.
- `features` → `entities` + `shared` 참조 가능.
- `app` → 모든 레이어 참조 가능.

---

## Blizzard API 상세

### 인증

- **방식**: Client Credentials OAuth 2.0 (서버 to 서버, 개인 캐릭터 데이터 불필요)
- **토큰 발급**: `POST https://kr.battle.net/oauth/token` (Basic Auth)
- **토큰 사용**: `Authorization: Bearer <token>` 헤더
- **토큰 TTY**: 약 24시간 (만료 60초 전 자동 갱신)

### 한국 리전 설정

| 항목              | 값                            |
| ----------------- | ----------------------------- |
| Base URL          | `https://kr.api.blizzard.com` |
| Locale            | `ko_KR`                       |
| profile namespace | `profile-kr`                  |
| static namespace  | `static-kr`                   |
| dynamic namespace | `dynamic-kr`                  |

### 현재 사용 중인 엔드포인트

#### 캐릭터 프로필 요약

```
GET /profile/wow/character/{realmSlug}/{characterName}
Namespace: profile-kr

주요 응답 필드:
  name, id
  equipped_item_level
  active_spec: { id, name }
  character_class: { id, name }
  realm: { slug, name }
```

#### 길드 멤버 로스터

```
GET /data/wow/guild/{realmSlug}/{guildName}/roster
Namespace: profile-kr

주요 응답 필드:
  name, id, member_count
  members[]: {
    rank,
    character: { name, id, level, realm, playable_class, playable_race }
  }

⚠️ 주의: 길드 로스터 응답에는 각 멤버의 특성화(spec) 정보가 포함되지 않음.
   특성화 확인이 필요한 멤버는 개별 캐릭터 프로필을 별도 호출해야 함.
   → 길드 전체 일괄 분석 시 N+1 호출 발생. 배치 처리나 캐싱 전략 필요.
```

### 추가로 활용 가능한 엔드포인트 (미구현)

#### 캐릭터 장비 상세

```
GET /profile/wow/character/{realm}/{name}/equipment
Namespace: profile-kr
→ 슬롯별 아이템, 인챈트, 보석 정보. 아이템레벨 상세 분석에 활용 가능.
```

#### 캐릭터 특성화 (현재 알려진 이슈 있음)

```
GET /profile/wow/character/{realm}/{name}/specializations
Namespace: profile-kr
→ 현재 찍은 탤런트 트리 노드 정보. 2025년 기준 loadout 데이터 누락 이슈 존재.
   특정 탤런트 픽 여부 확인(예: 영웅심 탤런트)에 활용 가능하나 신뢰도 낮음.
```

#### 캐릭터 신화 키스톤 프로필

```
GET /profile/wow/character/{realm}/{name}/mythic-keystone-profile/season/{seasonId}
Namespace: profile-kr
→ 블리자드 공식 M+ 점수와 던전별 기록. Raider.IO와 병행 활용 가능.
```

#### 플레이어블 클래스/특성화 메타데이터

```
GET /data/wow/playable-specialization/index
GET /data/wow/playable-specialization/{specId}
Namespace: static-kr
→ 스펙 ID, 명칭, 역할(TANK/HEALER/DAMAGE) 공식 조회 가능.
   현재 buffs.ts의 하드코딩 매핑 대신 API 기반으로 전환 가능 (단, 빌드 타임 캐싱 권장).
```

---

## Raider.IO API 상세

- **Base URL**: `https://raider.io/api/v1`
- **인증**: 불필요 (공개 API)
- **Rate Limit**: 공식 명시 없음, 과도한 호출 자제

### 캐릭터 프로필 엔드포인트

```
GET /characters/profile
  ?region=kr
  &realm={realm}
  &name={name}
  &fields={comma-separated fields}

현재 프로젝트 사용 fields:
  mythic_plus_scores_by_season:season-tww-2
  raid_progression
```

### 응답 필드 구조

```typescript
// 기본 필드 (fields 파라미터 없이도 반환)
name, race, class, active_spec_name, active_spec_role
thumbnail_url, profile_url
realm, region

// mythic_plus_scores_by_season
[{
  season: "season-tww-2",
  scores: {
    all: number,      // 전체 점수 (메인 지표)
    dps: number,
    healer: number,
    tank: number,
  }
}]

// raid_progression
{
  "{raid-slug}": {
    summary: "10/10 N, 10/10 H, 5/10 M",   // 표시용 요약 문자열
    total_bosses: number,
    normal_bosses_killed: number,
    heroic_bosses_killed: number,
    mythic_bosses_killed: number,
  }
}
```

### 추가로 활용 가능한 fields

```
mythic_plus_highest_level_runs   → 최고 레벨 M+ 기록 (키 레벨, 던전, 시간 등)
mythic_plus_recent_runs          → 최근 M+ 기록
mythic_plus_best_runs            → 던전별 최고 기록
previous_mythic_plus_scores      → 이전 시즌 점수
guild                            → 소속 길드 정보
```

---

## API 설계 원칙

### Blizzard Secret 보호 (필수)

클라이언트에서 Blizzard API 직접 호출 **절대 금지**.
반드시 `src/app/api/` Route Handler를 통해 프록시한다.

```
클라이언트 (React)
  ↓ apiClient (/api/...)
Route Handler (Next.js 서버)
  ↓ blizzardClient 또는 axios
Blizzard API / Raider.IO API
```

### blizzardClient interceptor 패턴

- **Request interceptor**: `getBlizzardToken()` → `Authorization: Bearer <token>` 자동 주입
- **Response interceptor**: 401 → `invalidateToken()` → 토큰 재발급 → 1회 재시도
- **재시도 중복 방지**: `WeakSet<InternalAxiosRequestConfig>` (타입 단언 없음)
- **토큰 중복 요청 방지**: inflight Promise 공유 (`inflightRequest`)
- **oauthClient 분리**: 토큰 발급용 별도 인스턴스 (blizzardClient interceptor 재귀 방지)

### Query Key 관리

`@lukemorales/query-key-factory` 사용. 모든 키는 `shared/lib/query-keys.ts`에서 중앙 관리.

```ts
characterKeys.summary(realm, name) // 개별 키
characterKeys._def // 캐릭터 엔티티 전체 무효화
queries // 앱 전체 (mergeQueryKeys)
```

### 새 Blizzard 엔드포인트 추가 순서

1. `src/app/api/` Route Handler 생성
2. `entities/{domain}/api.ts` API 함수 추가
3. `shared/lib/query-keys.ts` 키 추가
4. `entities/{domain}/queries.ts` queryOptions 추가
5. feature UI 연결

---

## 환경변수

```bash
# .env.local (로컬 개발용)
BLIZZARD_CLIENT_ID=
BLIZZARD_CLIENT_SECRET=
```

GitHub Actions CI에서는 저장소 Secrets에 동일한 키 등록 필요.

---

## 작업 완료 체크리스트

**매 작업 완료 후 반드시 순서대로 실행:**

```bash
# 1. 타입 체크
node node_modules/typescript/lib/tsc.js --noEmit

# 2. 린트
node node_modules/eslint/bin/eslint.js src/ --fix

# 3. 빌드 검증 (반드시 통과해야 커밋 가능)
npm run build

# 4. 커밋 & 푸시 (develop 브랜치)
git add -A && git commit -m "..." && git push origin develop
```

- 빌드가 실패하면 커밋하지 않는다. 반드시 빌드 통과 후 커밋.
- 작업 중에도 의미 있는 단위마다 주기적으로 커밋 & 푸시한다.
- 브랜치는 항상 `develop`. `main`은 PR로만.

## 코드 규칙 (전역 CLAUDE.md 보완)

- `export default`는 Next.js page/layout에서만 허용 (라우팅 필수 요건)
- 버프 매핑 수정 시 `buffs.ts` 스펙 ID를 Playable Specialization API로 검증:
  `GET /data/wow/playable-specialization/index` (Namespace: static-kr)
- 길드 로스터 → 특성화 분석 시 N+1 호출 주의. `Promise.allSettled` + 배치 처리 활용.
- Raider.IO 현재 시즌 상수는 `src/app/api/raiderio/[realm]/[name]/route.ts`의 `CURRENT_SEASON`에서 관리. 시즌 변경 시 이 값만 수정.
