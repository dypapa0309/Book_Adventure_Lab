/* ==========================================================
   assets/js/analytics.js
   Book Adventure Lab — 전환 추적 유틸리티

   역할
   ----
   · window.dataLayer 안전 초기화 (GTM/GA4/당근 공통)
   · trackBookLabEvent() — 모든 페이지에서 쓰는 단일 이벤트 함수
   · trackBeforeNavigate() — tel:/카카오 등 외부 이동 전 안전 전송
   · window.__BOOKLAB_DEBUG__ — 콘솔 디버그 객체
   · 1회성 이벤트 중복 방지 (_firedOnce Set)

   로드 순서 (index.html 참고)
   ---------------------------
   <script src="/assets/js/analytics.js"></script>  ← head에 동기 로드
   <!-- 당근 픽셀 placeholder -->
   <!-- GTM head snippet placeholder -->
   ...
   <script src="/assets/js/core/common.js" defer></script>
   <script src="/assets/js/pages/home.js" defer></script>
========================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------
     1) dataLayer 안전 초기화
        GTM snippet 이전에 반드시 선언되어야 함
  -------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];

  /* --------------------------------------------------------
     2) 디버그 객체
        브라우저 콘솔: window.__BOOKLAB_DEBUG__
        · events    — 이번 세션에서 발생한 전체 이벤트 배열
        · lastEvent — 마지막으로 발생한 이벤트
        · enabled   — false 로 바꾸면 콘솔 출력 억제 (프로덕션 조용히)
  -------------------------------------------------------- */
  window.__BOOKLAB_DEBUG__ = {
    events: [],
    lastEvent: null,
    enabled: true
  };

  /* --------------------------------------------------------
     3) 1회성 이벤트 중복 방지 Set
        landing_view, lead_complete 등 페이지당 1회만 허용
  -------------------------------------------------------- */
  var _firedOnce = new Set ? new Set() : { _s: [], has: function (k) { return this._s.indexOf(k) > -1; }, add: function (k) { this._s.push(k); } };

  /* --------------------------------------------------------
     4) 핵심 함수: trackBookLabEvent
        모든 이벤트는 이 함수 하나로 처리

        파라미터
        · eventName  {string}  — 이벤트 이름 (ex: 'consult_click')
        · payload    {object}  — 추가 데이터 (optional)
        · options    {object}  — { onlyOnce: true } 시 중복 방지

        공통 필드 (자동 삽입)
        · event        — eventName 그대로
        · page_path    — window.location.pathname
        · page_title   — document.title
        · timestamp    — Date.now()
  -------------------------------------------------------- */
  function trackBookLabEvent(eventName, payload, options) {
    if (typeof window === 'undefined') return; // SSR 환경 방어

    var opts = options || {};

    /* 1회성 이벤트 중복 방지 */
    if (opts.onlyOnce) {
      if (_firedOnce.has(eventName)) return;
      _firedOnce.add(eventName);
    }

    /* 공통 필드 + 호출자 payload 병합 */
    var event = Object.assign(
      {
        event:      eventName,
        page_path:  window.location.pathname,
        page_title: document.title,
        timestamp:  Date.now()
      },
      payload || {}
    );

    /* dataLayer push — GTM/GA4/당근 모두 여기서 수신 */
    window.dataLayer.push(event);

    /* 디버그 기록 + 콘솔 출력 */
    var dbg = window.__BOOKLAB_DEBUG__;
    if (dbg) {
      dbg.lastEvent = event;
      dbg.events.push(event);
      if (dbg.enabled && window.console) {
        /* 민감 정보(이름/전화) 콘솔 노출 방지: payload 중 마스킹 필요 항목 제거 */
        var safe = Object.assign({}, event);
        delete safe.parent_name;
        delete safe.phone;
        if (console.groupCollapsed) {
          console.groupCollapsed('[BookLab Track] ' + eventName);
          console.log(safe);
          console.groupEnd();
        } else {
          console.log('[BookLab Track]', eventName, safe);
        }
      }
    }
  }

  /* --------------------------------------------------------
     5) 외부 이동 전 안전 전송: trackBeforeNavigate
        tel:, 카카오 오픈채팅 등 페이지를 벗어나는 링크 클릭 시
        이벤트가 dataLayer에 push된 뒤 이동하도록 150ms 딜레이

        navigator.sendBeacon 지원 시 추가로 beacon 전송 가능
        (GTM이 자체 처리하므로 기본 off, 필요 시 주석 해제)
  -------------------------------------------------------- */
  function trackBeforeNavigate(eventName, payload, href, newTab) {
    trackBookLabEvent(eventName, payload);

    if (!href) return;

    /* sendBeacon 확장 포인트 (선택) */
    /*
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', JSON.stringify(Object.assign({ event: eventName }, payload)));
    }
    */

    if (newTab) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      /* GTM이 flush 할 시간을 150ms 확보 */
      setTimeout(function () {
        window.location.href = href;
      }, 150);
    }
  }

  /* --------------------------------------------------------
     6) 전역 노출
        어느 페이지/스크립트에서도 호출 가능
  -------------------------------------------------------- */
  window.trackBookLabEvent  = trackBookLabEvent;
  window.trackBeforeNavigate = trackBeforeNavigate;

})();
