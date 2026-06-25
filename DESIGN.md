---
version: alpha
name: Triplog Design Prototype
description: 전국 랜드마크 인증 앱 UI 프로토타입 — 민트·틸 기반 여행 수집형 인터페이스
colors:
  primary: "#3A8D84"
  primary-dark: "#2E7269"
  primary-light: "#4BA399"
  accent-mint: "#A5D6A7"
  accent-orange: "#FF9600"
  accent-blue: "#4A90D9"
  surface: "#F5F7F6"
  on-surface: "#1F2937"
  on-surface-muted: "#6B7280"
  white: "#FFFFFF"
  border: "#E8ECEB"
typography:
  label-sm:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  title-md:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.35
  display-lg:
    fontFamily: "Pretendard, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 28px
  4xl: 32px
  5xl: 36px
  full: 999px
spacing:
  2xs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px
  7xl: 80px
  8xl: 96px
components:
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: 16px
    border: "1px solid {colors.border}"
---

# Triplog Design Prototype

## Overview

한국 전역 랜드마크를 GPS로 수집·인증하는 모바일 앱 UI 프로토타입. 차분한 틸 그린 + 소프트 민트 톤. 깊이는 **그림자 없이** 보더·배경 대비·인터랙션(탭 스케일, 화면 전환, 활성 보더)으로 표현한다.

## Colors

- **Primary (#3A8D84):** 헤더·활성 칩·FAB·강조 영역.
- **Accent Mint (#A5D6A7):** 방문 완료 랜드마크 카드.
- **Surface (#F5F7F6):** 스크롤 배경·미방문 카드 베이스.

## Typography

- **Display (24px Bold):** 히어로 "전국 랜드마크 인증".
- **Title (18px Bold):** 화면 타이틀·지역명.
- **Body (15px):** 설명·주소.
- **Label (12px SemiBold):** 칩·탭·네비.

## Layout

- 모바일 프레임 390×844px, 하단 pill 탭 플로팅.
- 카드·시트는 `border: 1px solid var(--border)` 로 구분. **box-shadow 사용 금지.**

## Do's and Don'ts

- Do: 탭·카드·칩에 `:active` 스케일·배경 변화로 피드백.
- Do: 화면 전환 시 짧은 fade/slide (200~300ms).
- Don't: box-shadow, drop-shadow, text-shadow.
- Don't: 순수 검정(#000) — `#1F2937` 사용.
