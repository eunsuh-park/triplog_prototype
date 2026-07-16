---
version: prototype-2026
name: Triplog Design System
description: 전국 랜드마크 인증 앱 UI 프로토타입 — 블루 기반 수집형 모바일 인터페이스
source_of_truth: css/tokens.css
---

# Triplog 디자인 규칙

코드베이스(`css/tokens.css`, `css/base.css`, `css/screens.css`, `app.html`)에서 추출한 **실제 구현 기준** 디자인 규칙입니다.

---

## 1. 제품 톤 & 원칙

| 원칙 | 설명 |
|------|------|
| **수집·탐험** | 지도, 도감, 카드 그리드, 달성률·진행 바로 “모으는” 경험을 전달 |
| **밝고 가벼운 UI** | 흰 배경 + 연한 서피스(`--surface`) + 파란 포인트 |
| **보더 우선** | 카드·패널 구분은 `1px solid var(--border)`가 기본. 그림자는 보조·제한적 |
| **터치 피드백** | 클릭 가능 요소는 `is-pressable` + `:active` 스케일·배경 변화 |
| **모바일 1열** | 프레임 `max-width: 390px`, `height: 844px`, 세로 스크롤 중심 |

---

## 2. 색상 (`css/tokens.css`)

### 브랜드 & 액센트

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--primary` | `#368FFF` | CTA, 활성 탭·칩, FAB, 진행 바, 지도 방문 영역 |
| `--primary-dark` | `#1A85E8` | `:active` 눌림, FAB 테두리 |
| `--primary-light` | `#1AADF6` | 보조 강조 |
| `--primary-soft` | `#F1F7FF` | 히어로 그라데이션, 행 hover, 소프트 버튼 배경 |
| `--accent-mint` / `--highlight-teal` | `#0ECEDB` | 수집 완료 칩 등 포인트 |
| `--accent-gold` | `#E8B84A` | L등급, 랭크 골드 |
| `--accent-orange` | `#FF9600` | 보조 강조 |
| `--accent-blue` | `#368FFF` | R등급, 랭킹 점수 등 |

### 표면 & 텍스트

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--white` | `#ffffff` | 카드, 시트, 네비 pill |
| `--surface` | `#F5F6F7` | 스크롤 영역·지도 배경·비활성 토글 트랙 |
| `--surface-dim` | `#EEF0F2` | 진행 바 트랙, 잠금/비활성 지도 |
| `--text` | `#1B1D1F` | 본문·제목 (순수 `#000` 사용 안 함) |
| `--text-secondary` | `#7E848A` | 부제, 메타, **비활성 아이콘** |
| `--text-muted` | `#ADB1B5` | 더 약한 보조 텍스트 |
| `--border` | `#E8EAEC` | 기본 구분선 |
| `--border-strong` | `#D5D8DB` | 폰 프레임 등 |

### 지도 전용

| 토큰 | 용도 |
|------|------|
| `--map-land` | 미방문/기본 영역 채움 |
| `--map-land-active` | 방문·선택 영역 (`--primary`와 동일) |

**규칙:** 새 색은 토큰에 추가 후 사용. 하드코딩은 등급 태그·일부 랭크 티어 등 예외만 허용.

---

## 3. 타이포그래피

- **폰트:** `Pretendard` → 시스템 UI 폴백 (`base.css`)
- **기본 크기:** `15px` (`--text-base`), `line-height: 1.45`

| 토큰 | 크기 | typical weight | 용도 |
|------|------|----------------|------|
| `--text-xs` | 12px | 400–600 | 팩트, 주소, 네비 라벨 |
| `--text-sm` | 14px | 600 | 칩, 탭, 토스트 |
| `--text-base` | 15px | 400 | 본문 |
| `--text-md` | 18px | 700 | 카드명, 섹션 타이틀 |
| `--text-lg` | 20px | 700 | 지역 상세 제목 |
| `--text-xl` | 24px | 700 | 히어로 타이틀 |
| `--text-2xl` ~ `--text-3xl` | 28–32px | 700 | 랭킹·프로필 대형 숫자 |

**규칙:** 화면당 제목 계층은 1단계만 크게 키운다. 강조는 **굵기·색(`--primary`)** 로, 크기 남용 지양.

---

## 4. 간격 & 라운드

### Spacing

`--space-xs`(4) · `--space-sm`(8) · `--space-md`(12) · `--space-lg`(16) · `--space-xl`(20) · `--space-2xl`(24) …

- 화면 좌우 패딩: **16px** (`--space-lg`)가 기본
- 카드/그리드 gap: **10–12px**
- 섹션 간: **16–20px**

### Radius

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-sm` | 8px | 작은 요소 |
| `--radius-md` | 12px | 토스트(오버라이드) |
| `--radius-lg` | 16px | 카드, 메뉴 |
| `--radius-xl` | 20px | 시트 상단, 미니맵(구버전) |
| `--radius-5xl` | 36px | 풀폭 CTA 버튼 |
| `--radius-full` | 999px | 칩, pill 버튼, FAB, 하단 네비 |

---

## 5. 레이아웃 & 네비게이션

### 앱 셸

```
.phone--interactive (390×844)
├── .status-bar (44px)
├── .screen-body
│   └── .screen-panel[data-screen] (한 번에 하나만 .active)
└── .bottom-nav (플로팅 pill, bottom ~14–16px)
```

### 화면 유형

| 유형 | 예시 `data-screen` | 하단 네비 |
|------|-------------------|-----------|
| 탭 화면 | `map`, `dex`, `rank`, `settings` | 표시 |
| 서브 화면 | `exploreProvince`, `detail`, `certify*` … | `.hidden` |
| 지도 + 시트 | `map` + `province-sheet.is-open` | 숨김 |

### 스크롤

- `.screen-scroll`: 탭 본문 세로 스크롤
- `.screen-scroll--surface`: 배경 `--surface`
- 스크롤바: WebKit에서 `width: 0` (숨김)
- 탭 화면(`map` 제외): 스크롤 다운 시 `.bottom-nav.is-scroll-hidden`으로 네비 슬라이드 아웃

### 지도 화면 (`explore-national`)

- 지도: `position: absolute; inset: 0` 풀블리드
- 헤더 카피: 상단 오버레이 (`explore-national__head`)
- FAB: 우하단 `52×52`, `--primary`, 흰 테두리
- 시·도 진입 시: `korea-map--province` + 상단 툴바(전국 지도 / 지역명 / 탐험하기)

---

## 6. 컴포넌트 패턴

### 칩 (`.chip`)

- 기본: 흰 배경 + `--border` + `--text-secondary`
- 활성 (`.active`): `--primary` 배경·보더, 흰 글자
- 패딩 `10px 18px`, `--radius-full`
- 가로 스크롤 행: `.region-chips`, `.filter-chips`

### 탭 (언더라인형)

`.region-detail__tab` 패턴:

- 비활성: `--text-secondary`, 하단 보더 투명
- 활성: `--primary` 글자 + `2px` 하단 보더
- flex 1 균등 분할, 패딩 `12px 8px`

### 토글 (`.region-view-toggle`)

- 트랙: **흰 배경** + `--border` + `--radius-full`
- 버튼: `32×32` 원형
- **비활성 아이콘:** `--text-secondary` (필터 버튼과 동일)
- **활성:** `--primary` 배경 + 흰 아이콘

### 버튼

| 클래스 | 스타일 |
|--------|--------|
| `.btn-primary` | 풀폭, min-height 56px, `--primary`, `--radius-5xl` |
| `.btn-outline` | 흰 배경 + primary 보더 |
| `.btn-soft` | `--primary-soft` 배경 |
| `.btn-back` | `40×40` 원형, `--surface` 또는 반투명 흰 (지도 위) |
| `.region-detail__home-btn--info` | pill, primary 채움 + 아이콘 + 라벨 |

### 카드 & 리스트

- `.region-row`, `.landmark-card`, `.collect-card`: 흰 배경 + 보더 + `:active` 시 `--primary-soft`
- `.region-stat-card`: 연한 primary 틴트 박스, 2열 통계
- `.progress-bar`: 높이 6–8px( thick 14px ), 트랙 `--surface-dim` / `--primary-soft`, fill `--primary`

### 등급 (`.grade-tag`)

| 등급 | 배경(soft) | solid (캐러셀 등) |
|------|------------|-------------------|
| L | gold 틴트 | `--accent-gold` |
| E | 보라 틴트 | `#8B5CF6` |
| R | blue 틴트 | `--accent-blue` |
| U | primary-soft | `--primary` |
| C | surface-dim | `#9AA4AE` |

### 바텀 시트

| 종류 | 클래스 | 높이/동작 |
|------|--------|-----------|
| 도시 | `.city-sheet` | 콘텐츠 높이, 상단 핸들 |
| 시·도 상세 peek | `.province-sheet` | **30%** (`min-height: 220px`), 드래그 업 → 상세 화면 |

공통: 상단 `--radius-xl`, `border-top: 1px solid var(--border)`, 핸들 `36×4px` `--border`

### 토스트 (`.toast`)

- 상단 중앙, `--text` 배경, 흰 글자
- 프로토타입 피드백용 (“준비 중” 등)

---

## 7. 아이콘

- **세트:** [MingCute](https://iconify.design) (`iconify-icon`)
- **선택 규칙:**
  - 일반 액션: `*-line`
  - 완료·강조: `*-fill`
  - 크기: 14–22px (버튼 내 18px 다수)
- **비활성/보조:** `--text-secondary` 색상 통일

---

## 8. 모션 & 인터랙션

| 토큰 | 값 |
|------|-----|
| `--dur-fast` | 0.15s |
| `--dur-normal` | 0.25s |
| `--dur-slow` | 0.35s |
| `--ease-out` | cubic-bezier(0.32, 0.72, 0, 1) |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) |

| 패턴 | 동작 |
|------|------|
| `.is-pressable:active` | `scale(0.97)` |
| 카드/칩 | `scale(0.94–0.96)` 또는 배경 `--primary-soft` |
| `.screen-panel` 진입 | fade + `translateY(10px)` → 0 |
| FAB | `:active scale(0.92)` (pulse ring은 오버라이드로 비활성화됨) |
| 바텀 네비 | `translateY(100%+24px)` 숨김 |

---

## 9. 그림자 정책

**지향:** 평면 UI — 보더와 배색으로 깊이 표현.

**현재 코드 예외 (신규 추가 시 동일 수준만 허용):**

- 시트 상단: `box-shadow: 0 -8px 28px rgba(20, 40, 80, 0.12)`
- 지도 마커: `drop-shadow` (미니맵)
- 맵 헤더 텍스트 가독: `text-shadow` (흰 그라데이션 위)
- 일부 랭킹/프로필 카드: 아주 약한 shadow

**Don't:** 카드·리스트 기본에 heavy shadow 추가.

---

## 10. 화면별 레이아웃 메모

### 지역 상세 (`region-detail`)

- 미니맵: 헤더 **풀블리드** (좌우·상단 여백 없음, 보더 없음)
- 스테이터스바: 지도 위 절대 배치 + 그라데이션
- 탭: 정보 | 카드
- 카드 탭 툴바: 필터(좌) + 보기 토글(우), **콘텐츠와 함께 스크롤**

### 도감 (`dex`)

- 상단 `tab-header` / `home-hero` (다크 스테이터스바)
- 지역 칩: 모두 | 수도권 | 광역시 | 도

### 인증 플로우 (`cert-flow__*`)

- 상단 다크/라이트 헤더 변형
- 하단 고정 CTA (`cert-flow__footer`)

---

## 11. BEM & 파일 구조

- **블록__요소--수식어** (`region-detail__tab.active`)
- **상태:** `.active`, `.hidden`, `.is-open`, `.is-pressable`
- **데이터 훅:** `data-screen`, `data-nav`, `data-region-*`, `data-go`
- CSS: `tokens.css` → `base.css`(공통) → `screens.css`(화면별)

---

## 12. Do / Don't

### Do

- 색·간격·라운드는 `tokens.css` 변수 사용
- 탭·칩·행에 `:active` 피드백
- 서브 화면에서 하단 네비 숨김
- 지도 위 컨트롤은 반투명 흰 + 보더로 가독성 확보
- 비활성 아이콘은 `--text-secondary`로 통일

### Don't

- API URL·키 하드코딩 (프로토타입도 env 분리 원칙 유지)
- 순수 검정 `#000`, 임의 회색 남발
- 서로 다른 탭/칩 스타일을 화면마다 새로 invent
- `box-shadow`를 기본 카드 스타일로 사용

---

## 13. 변경 시 체크리스트

1. `tokens.css`에 토큰이 있는가?
2. `is-pressable` / `:active` 피드백이 있는가?
3. 16px 좌우 패딩·보더 구분이 맞는가?
4. 서브 화면 네비 숨김이 `SUB_SCREENS`와 일치하는가?
5. 아이콘은 MingCute line/fill 규칙을 따르는가?

---

*마지막 동기화: 코드베이스 `main` (지역 상세 풀블리드, province-sheet, 카드 툴바 포함)*
