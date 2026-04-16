/* ==========================================================
   assets/js/core/common.js
   Book Adventure Lab — 공용 유틸리티

   역할
   ----
   · window.BAL 네임스페이스 초기화
   · 공용 모달 시스템 (BAL.modal.open / close)
   · 연도 자동 업데이트 (.y 클래스)
   · 모든 페이지에 defer 로드
========================================================== */

(function () {
  'use strict';

  if (window.__bal_common_inited__) return;
  window.__bal_common_inited__ = true;

  /* --------------------------------------------------------
     1) BAL 네임스페이스
  -------------------------------------------------------- */
  window.BAL = window.BAL || {};

  /* --------------------------------------------------------
     2) 연도 자동 업데이트
        HTML: <span class="y"></span> 또는 <span id="y"></span>
  -------------------------------------------------------- */
  var year = new Date().getFullYear();
  document.querySelectorAll('.y, #y').forEach(function (el) {
    el.textContent = year;
  });

  /* --------------------------------------------------------
     3) 공용 모달 시스템
        사용법:
          BAL.modal.open({
            title: '제목',
            body:  '내용',
            actions: [
              { label: '확인', className: 'primary', onClick: fn, closeOnClick: true },
              { label: '취소', closeOnClick: true }
            ]
          });

        HTML 필요 구조 (#modal 은 index.html/test/index.html 에 있음):
          <div class="modal" id="modal" aria-hidden="true" role="dialog" aria-modal="true">
            <div class="modal__dim" data-close="1"></div>
            <div class="modal__panel" role="document">
              <div class="modal__head">
                <h3 class="modal__title" id="modal-title">알림</h3>
                <button class="modal__close" type="button" data-close="1" aria-label="닫기">닫기</button>
              </div>
              <div class="modal__body" id="modal-body"></div>
              <div class="modal__actions" id="modal-actions">
                <button class="modal__btn" type="button" data-close="1">확인</button>
              </div>
            </div>
          </div>
  -------------------------------------------------------- */
  (function initModal() {
    var modal     = document.getElementById('modal');
    if (!modal) return;

    var titleEl   = document.getElementById('modal-title');
    var bodyEl    = document.getElementById('modal-body');
    var actionsEl = document.getElementById('modal-actions');

    function open(opts) {
      opts = opts || {};

      if (titleEl)   titleEl.textContent = opts.title || '알림';
      if (bodyEl)    bodyEl.textContent  = opts.body  || '';

      if (actionsEl) {
        actionsEl.innerHTML = '';
        var actions = opts.actions || [{ label: '확인', className: 'primary', closeOnClick: true }];
        actions.forEach(function (action) {
          var btn = document.createElement('button');
          btn.className = 'modal__btn' + (action.className ? ' ' + action.className : '');
          btn.textContent = action.label || '확인';
          btn.type = 'button';
          btn.addEventListener('click', function () {
            if (typeof action.onClick === 'function') action.onClick();
            if (action.closeOnClick !== false) close();
          });
          actionsEl.appendChild(btn);
        });
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');

      /* 포커스 트랩: 첫 번째 버튼으로 이동 */
      var firstBtn = modal.querySelector('button');
      if (firstBtn) firstBtn.focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    /* dim 또는 data-close="1" 클릭 → 닫기 */
    modal.addEventListener('click', function (e) {
      var t = e.target;
      if (t && typeof t.getAttribute === 'function' && t.getAttribute('data-close') === '1') {
        close();
      }
    });

    /* ESC 키 → 닫기 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    window.BAL.modal = { open: open, close: close };
  })();

})();
