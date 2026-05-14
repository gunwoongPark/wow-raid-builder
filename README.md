# Raid Scope

공대장을 위한 월드 오브 워크래프트 공격대 구성 분석 서비스.

Blizzard API · Raider.IO · Warcraft Logs로 캐릭터 데이터를 자동 수집하고, 버프/유틸 커버리지 시각화와 파티 프레임 편성을 제공합니다.

**→ [raid-scope.vercel.app](https://raid-scope.vercel.app)**

---

## 주요 기능

- **캐릭터 검색** — 서버·닉네임으로 자동완성 검색 (KR/US 리전 자동 선택)
- **로스터 관리** — 최대 30인 공격대 구성, URL 공유·프리셋 저장
- **버프/유틸 분석** — 한밤(Midnight) 기준 클래스별 버프 커버리지 시각화
- **파티 프레임** — 6파티 × 5인 드래그앤드롭 편성 (목록/파티프레임 뷰 URL 기반 토글)
- **WCL 파싱** — 레이드 로그 퍼센트 색상 표시 (골드/보라/파랑/초록)
- **다국어** — 한국어(KR 리전) · 영어(US 리전) 국가 기반 자동 감지, 수동 전환 가능

## 기술 스택

| 역할   | 선택                                               |
| ------ | -------------------------------------------------- |
| 프레임 | Next.js 16 (App Router, Turbopack, React Compiler) |
| 상태   | TanStack Query v5 + Zustand v5                     |
| 폼     | React Hook Form v7 + Zod v4                        |
| UI     | Tailwind CSS v4 + shadcn/ui + warcraftcn           |
| 다국어 | next-intl v4                                       |
| 호스팅 | Vercel                                             |

## 외부 API

- **Blizzard** — 캐릭터 정보, 아이템 레벨 (OAuth Client Credentials, KR/US 리전)
- **Raider.IO** — M+ 점수, 공격대 진행도 (KR/US 리전)
- **Warcraft Logs** — 레이드 로그 퍼센트 (KR/US 서버 리전)

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local  # 환경변수 설정
pnpm dev
```

### 필수 환경변수

```bash
NEXT_PUBLIC_BASE_URL=
BLIZZARD_CLIENT_ID=
BLIZZARD_CLIENT_SECRET=
WARCRAFT_LOGS_CLIENT_ID=
WARCRAFT_LOGS_CLIENT_SECRET=
```

## Maintainer

- [@gunwoongPark](https://github.com/gunwoongPark)
