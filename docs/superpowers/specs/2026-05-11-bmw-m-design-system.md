# BMW M 디자인 시스템 적용 — pt-app

## 개요

BMW M 마케팅 디자인 시스템을 운동 앱(pt-app)에 완전 적용한다. 순수 블랙 캔버스, M 트라이컬러 스트라이프 포인트, UPPERCASE 타이포그래피, hairline 테두리, 각진 버튼이 핵심이다.

---

## 색상 토큰

| 역할 | 값 | 기존 |
|---|---|---|
| 캔버스 (배경) | `#000000` | `#0F0F0F` |
| Surface Soft (스펙 셀) | `#0d0d0d` | - |
| Surface Card | `#1a1a1a` | `#1A1A1A` (유지) |
| Hairline (테두리) | `#3c3c3c` | `rgba(255,255,255,0.05)` |
| 기본 텍스트 | `#ffffff` | `#ffffff` (유지) |
| Body 텍스트 | `#bbbbbb` | `#gray-400` |
| Muted 텍스트 | `#7e7e7e` | `#gray-500` |
| M Blue Light | `#0066b1` | - |
| M Blue Dark (포인트) | `#1c69d4` | `#3B82F6` (blue-500) |
| M Red | `#e22718` | `#F97316` (orange) |

**Tailwind 커스텀 색상으로 등록** (`tailwind.config.js` 또는 `index.css`의 CSS 변수):
```css
--canvas: #000000;
--surface-soft: #0d0d0d;
--surface-card: #1a1a1a;
--hairline: #3c3c3c;
--body: #bbbbbb;
--muted: #7e7e7e;
--m-blue: #1c69d4;
--m-blue-light: #0066b1;
--m-red: #e22718;
```

---

## 타이포그래피

| 역할 | 크기 | 굵기 | 특징 |
|---|---|---|---|
| 페이지 헤더 h1 | 32–36px | 700 | UPPERCASE, letter-spacing: 0 |
| 섹션 타이틀 | 24px | 700 | UPPERCASE |
| 레이블 (탭/버튼) | 9–11px | 700 | UPPERCASE, letter-spacing: 1.5px |
| 수치 (스펙 셀) | 24–32px | 700 | - |
| 본문 | 12–13px | 300 | sentence-case |
| Muted / 캡션 | 10–11px | 300 | - |

**폰트**: 기존 system-ui 스택 유지 (Inter 또는 system font). BMW Type Next Latin 미사용.

---

## 간격 & 레이아웃

- 섹션 간격: `20px` 수평 패딩 (기존 `mx-5` 유지)
- 컴포넌트 간격: `8px` (기존 `gap-3` → `gap-2`)
- 카드 내부 패딩: `14–16px`
- 스펙 셀 내부 패딩: `14px`

---

## 컴포넌트 변경 사항

### 1. `index.css` — 전역

- `body` 배경: `#0F0F0F` → `#000000`
- CSS 변수 추가

### 2. M 트라이컬러 스트라이프 (`MStripe` 공통 컴포넌트)

```jsx
// src/components/MStripe.jsx
export default function MStripe() {
  return (
    <div style={{
      height: '4px',
      background: 'linear-gradient(to right, #0066b1 33%, #1c69d4 33% 66%, #e22718 66%)'
    }} />
  );
}
```

모든 페이지 헤더 아래에 삽입.

### 3. `BottomNav.jsx`

- 배경: `#0d0d0d`
- 테두리: `border-top: 1px solid #3c3c3c`
- Active 탭: 텍스트 흰색 + 하단 `2px solid #1c69d4` (기존 파란 텍스트 색상 제거)
- 비활성 탭: `#7e7e7e`
- 레이블: UPPERCASE, `letter-spacing: 1px`, `font-size: 8px`, `font-weight: 700`

### 4. `Home.jsx`

**헤더:**
- 날짜: `color: #7e7e7e`, `font-size: 11px`, UPPERCASE, `letter-spacing: 1.5px`
- h1: `font-size: 36px`, `font-weight: 700`, UPPERCASE, `line-height: 1.0`
- MStripe 컴포넌트 헤더 아래 삽입

**스트릭 + 루틴 → 스펙 셀 그리드:**
- 기존 `rounded-2xl` 카드 제거
- `display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #3c3c3c`
- 각 셀: `background: #0d0d0d; padding: 16px; border-radius: 0`
- 레이블: UPPERCASE 9px 700, muted
- 수치: 32px 700 흰색

**달성률 → 스펙 셀 3개:**
- 운동% / 칼로리 / 체중을 3열 스펙 셀로 표시
- 링 차트(`RingChart`) 제거
- 각 셀 아래 2px 그라디언트 진행 바

**체중 입력:**
- `rounded-xl` → `border-radius: 0`
- 인풋: hairline 테두리 (`border: 1px solid #3c3c3c`), 배경 `#0d0d0d`
- 저장 버튼: `border: 1px solid #ffffff`, 배경 투명, UPPERCASE

**골격근량 진행률:**
- hairline 카드 (`border: 1px solid #3c3c3c`)
- 진행 바: `height: 2px`, M 블루 그라디언트

**빠른 실행 버튼:**
- 운동: `background: #1c69d4`, `border-radius: 0`, UPPERCASE 레이블
- 식단: `border: 1px solid #3c3c3c`, `background: transparent`, UPPERCASE 레이블

### 5. `Workout.jsx`

**헤더:**
- 날짜 이동 버튼: `border: 1px solid #3c3c3c`, `border-radius: 0`
- h1: UPPERCASE 24px 700
- 오늘 표시: `color: #1c69d4`, UPPERCASE, letter-spacing

**요일 탭:**
- `border-bottom: 1px solid #3c3c3c` 컨테이너
- Active: `color: #fff`, `border-bottom: 2px solid #1c69d4`
- 비활성: `color: #7e7e7e`
- 레이블: UPPERCASE 9px 700 letter-spacing

**완료율:**
- hairline 카드
- 수치: 24px 700
- 바: `height: 2px`, M 블루 그라디언트

**WeightCard (운동 카드):**
- 기본: `border: 1px solid #3c3c3c`, `border-radius: 0`
- 완료: `border-color: #3c3c3c` (변화 없음, 텍스트 muted + line-through)
- 펼침 active: `border: 1px solid #1c69d4`
- 체크 버튼: 정사각형 (`border-radius: 0`), 완료 시 `background: #1c69d4`
- 세트 레이블: `SET 1` UPPERCASE 700
- 세트 인풋: `border: 1px solid #3c3c3c` (포커스: `#1c69d4`), `border-radius: 0`, `background: #0d0d0d`

**YouTube 버튼:**
- `background: #e22718`, `border-radius: 0`
- UPPERCASE `▶ YOUTUBE` 레이블

**CardioCard:**
- WeightCard와 동일한 스타일 원칙
- 시간 인풋: 동일 hairline 스타일

### 6. `Diet.jsx`

**헤더:** Workout과 동일

**영양 요약 → 스펙 셀 2개:**
- 칼로리 / 단백질 2열 그리드
- 각 셀 안에 수치(26px 700) + `/ 목표` + 2px 그라디언트 바

**최근 먹은 것:**
- 각 항목: `border: 1px solid #3c3c3c`, `border-radius: 0`, `padding: 10px 14px`

**카테고리 탭:**
- `border-bottom: 1px solid #3c3c3c` 컨테이너
- Active: `color: #fff`, `border-bottom: 2px solid #fff`
- 비활성: `color: #7e7e7e`
- UPPERCASE, letter-spacing 1.5px

**음식 목록:**
- 단일 hairline 컨테이너 (`border: 1px solid #3c3c3c`)
- 항목 구분: `border-bottom: 1px solid #3c3c3c`
- 등급: `S/A/B/C/D` 레터 표시 (별점 제거)
- + 버튼: 각진 스타일

---

## 제거할 요소

| 제거 | 대체 |
|---|---|
| `rounded-2xl`, `rounded-xl` | `border-radius: 0` (전면) |
| `RingChart` 컴포넌트 | 스펙 셀 + 2px 진행 바 |
| `border border-white/5` | `border: 1px solid #3c3c3c` |
| `bg-blue-600` (버튼) | `background: #1c69d4` |
| `bg-orange-600` (버튼) | `border: 1px solid #3c3c3c` (outline) |
| 저장 버튼 (운동 세트) | 이미 제거됨 (자동저장) |
| `text-blue-400` active 색 | `color: #1c69d4` |

---

## 구현 순서

1. `index.css` — CSS 변수 + body 배경 변경
2. `MStripe.jsx` 컴포넌트 생성
3. `BottomNav.jsx` 리스타일
4. `Home.jsx` 리스타일 (RingChart 제거 포함)
5. `Workout.jsx` 리스타일
6. `Diet.jsx` 리스타일
7. `Progress.jsx`, `Calendar.jsx`, `Settings.jsx` — 동일 원칙 적용 (hairline + UPPERCASE)

---

## 변경하지 않는 것

- 데이터 구조 (`useAppData`, `useStorage`)
- 라우팅 구조
- 운동 자동 저장 / 최근 먹은 것 로직
- `vercel.json`
