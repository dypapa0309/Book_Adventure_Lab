# Book Adventure Lab

정적 사이트 구조를 아래처럼 정리했습니다.

## Structure

- `index.html`: 메인 랜딩 페이지
- `test/index.html`: 독해력 테스트 페이지
- `assets/css/common.css`: 공용 스타일
- `assets/css/pages/test.css`: 테스트 페이지 전용 스타일
- `assets/js/core/common.js`: 공용 유틸과 모달 초기화
- `assets/js/pages/home.js`: 메인 페이지 동작
- `assets/js/pages/test.js`: 테스트 페이지 동작
- `assets/images/`: 이미지 자산 모음

## Rule of Thumb

- 여러 페이지에서 함께 쓰면 `assets/css/common.css` 또는 `assets/js/core/common.js`
- 특정 페이지에서만 쓰면 `assets/css/pages/` 또는 `assets/js/pages/`
- 새 이미지는 `assets/images/`에 추가
