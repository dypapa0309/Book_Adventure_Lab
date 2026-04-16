# 책모험 연구소 — 전환 추적 설정 가이드

> 이 문서는 당근 픽셀, GTM, GA4 연결 방법과 이벤트 목록을 설명합니다.

---

## 1. 당근 픽셀 설치 현황 ✅

픽셀 ID: `1776331082027886001`

3개 파일 `<head>` 에 픽셀 코드 설치 완료.

| 파일 | 추적 이벤트 |
|---|---|
| `index.html` | `ViewPage` (랜딩 조회) |
| `test/index.html` | `ViewPage` (테스트 페이지 조회) |
| `thanks/index.html` | `ViewPage` + `Purchase` (신청 완료 전환) |

### 전환 이벤트 구조 (`thanks/index.html`)

```js
// sessionStorage 가드로 1회만 실행됨
if (typeof window.karrotPixel !== 'undefined') {
  window.karrotPixel.track('Purchase');  // 당근 관리자 전환 이벤트
}
```

---

## 2. GTM 연결 방법

### Step 1 — GTM 컨테이너 생성

1. [Google Tag Manager](https://tagmanager.google.com) 접속
2. 계정 생성 → 웹 컨테이너 생성 → 컨테이너 ID 확인 (예: `GTM-XXXXXXX`)

### Step 2 — 스니펫 삽입

`index.html`과 `thanks/index.html`에서 아래 주석을 찾아 교체합니다.

**`<head>` 안 (GTM_HEAD_SNIPPET_START ~ END 사이):**

```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

**`<body>` 바로 뒤 (GTM_BODY_NOSCRIPT_START ~ END 사이):**

```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### Step 3 — GTM에서 트리거 설정

GTM 컨테이너에서 아래 Custom Event 트리거를 추가하면  
모든 `trackBookLabEvent()` 이벤트를 GA4/당근과 연결할 수 있습니다.

| GTM 트리거 이름 | 이벤트 이름 | 태그 연결 |
|---|---|---|
| `trigger_landing_view` | `landing_view` | GA4 이벤트 태그 |
| `trigger_consult_click` | `consult_click` | GA4 이벤트 태그 |
| `trigger_phone_click` | `phone_click` | GA4 이벤트 태그 |
| `trigger_kakao_click` | `kakao_click` | GA4 이벤트 태그 |
| `trigger_lead_submit` | `lead_submit` | GA4 이벤트 태그 |
| `trigger_lead_complete` | `lead_complete` | GA4 전환 태그 + 당근 전환 태그 |

---

## 3. GA4 연결 방법

1. [Google Analytics](https://analytics.google.com) → 속성 생성 → 측정 ID 확인 (예: `G-XXXXXXXXXX`)
2. GTM에서 GA4 구성 태그 추가 → 측정 ID 입력
3. 각 이벤트 트리거에 GA4 이벤트 태그를 연결

---

## 4. 발생하는 이벤트 전체 목록

모든 이벤트는 `window.dataLayer`에 push됩니다.  
브라우저 콘솔에서 `window.__BOOKLAB_DEBUG__` 로 실시간 확인 가능합니다.

### 공통 필드 (모든 이벤트에 자동 포함)

| 필드 | 설명 |
|---|---|
| `event` | 이벤트 이름 |
| `page_path` | 현재 페이지 경로 |
| `page_title` | 현재 페이지 제목 |
| `timestamp` | Unix timestamp (ms) |

### 이벤트별 상세

#### `landing_view`
페이지 진입 시 1회 발생.

```js
{ event: 'landing_view', page_path: '/', page_title: '...' }
```

#### `consult_click`
CTA 버튼 클릭 시 발생.

| 필드 | 예시 값 |
|---|---|
| `location` | `hero` / `soft_cta` / `floating` / `test_result` |
| `inquiry_type` | `consult` / `trial` / `sms` |
| `button_text` | 버튼 텍스트 |

#### `phone_click`
전화 버튼 클릭 시 발생.

| 필드 | 값 |
|---|---|
| `location` | `contact` |
| `method` | `phone` |

#### `kakao_click`
카카오 문의 버튼 클릭 시 발생.

| 필드 | 값 |
|---|---|
| `location` | `contact` |
| `method` | `kakao` |

#### `lead_submit`
폼 유효성 통과 후 제출 시작 시 발생.

| 필드 | 예시 |
|---|---|
| `form_name` | `consult` |
| `inquiry_type` | `consult` / `trial` |
| `grade` | `초3` ~ `고3` |

#### `lead_complete`
`/thanks/` 페이지 진입 시 1회 발생 (sessionStorage 가드 적용).

| 필드 | 값 |
|---|---|
| `form_name` | `consult` |
| `complete_path` | `/thanks/` |

---

## 5. 카카오 문의 링크 설정

`index.html`에서 `#btn-kakao` 버튼의 `data-kakao-link` 속성 값을 교체합니다.

```html
<!-- 변경 전 -->
data-kakao-link="KAKAO_CONSULT_LINK_PLACEHOLDER"

<!-- 변경 후 (카카오 채널 또는 오픈채팅 URL) -->
data-kakao-link="https://open.kakao.com/o/sXXXXXXX"
```

---

## 6. Netlify Forms 이메일 알림 설정

1. [Netlify 대시보드](https://app.netlify.com) → 해당 사이트 → **Forms**
2. `consult` 폼 클릭 → **Form notifications** → **Add notification**
3. 이메일 주소 입력 → 저장

> 제출된 데이터는 Netlify 대시보드 Forms 탭에서도 확인 가능합니다.

나중에 Supabase나 Google Sheets 등 외부 DB를 연결하려면  
`home.js`의 폼 제출 섹션에서 `fetch('/', ...)` 부분을  
API 엔드포인트 호출로 교체하면 됩니다.

---

## 7. 로컬 테스트 방법

```bash
# 1) 아무 로컬 서버나 실행
npx serve .
# 또는
python3 -m http.server 3000

# 2) http://localhost:3000 접속
```

### 이벤트 확인

1. 브라우저 콘솔 열기 (F12)
2. 페이지 진입 → `[BookLab Track] landing_view` 출력 확인
3. 상담 버튼 클릭 → `[BookLab Track] consult_click` 확인
4. 폼 제출 → `[BookLab Track] lead_submit` 확인
5. `/thanks/` 접속 → `[BookLab Track] lead_complete` 확인

또는 콘솔에서 직접:

```js
window.__BOOKLAB_DEBUG__.events     // 전체 이벤트 배열
window.__BOOKLAB_DEBUG__.lastEvent  // 마지막 이벤트
window.dataLayer                    // dataLayer 전체
```

---

## 8. 배포 후 검증 체크리스트

- [ ] 페이지 진입 → 콘솔에 `landing_view` 출력
- [ ] "무료 체험수업 신청" 클릭 → `consult_click` (location: hero)
- [ ] 전화 버튼 클릭 → `phone_click`
- [ ] 카카오 버튼 클릭 → `kakao_click`
- [ ] 폼 작성 후 제출 → `lead_submit` → `/thanks/` 이동
- [ ] `/thanks/` 도착 → `lead_complete` (1회만)
- [ ] `/thanks/` 새로고침 → `lead_complete` 미발생 (중복 방지)
- [ ] Netlify 대시보드 Forms 탭에 제출 데이터 수신
- [ ] 모바일에서 폼/버튼 UI 깨짐 없음
- [ ] GTM Preview 모드에서 이벤트 수신 확인
- [ ] 당근 픽셀 설치 후 당근 관리자 이벤트 로그 확인
