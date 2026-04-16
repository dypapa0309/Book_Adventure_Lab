/* ==========================================================
   assets/js/pages/home.js
   책모험 연구소 — 홈 페이지 전용 JS

   의존성 (로드 순서)
   -----------------
   1. analytics.js  (head, 동기)  → window.trackBookLabEvent / trackBeforeNavigate
   2. common.js     (defer)       → window.BAL.modal
   3. home.js       (defer)       ← 이 파일

   추적 이벤트 목록
   ----------------
   · landing_view   — 페이지 진입 시 1회
   · consult_click  — CTA 버튼 클릭 (상담/체험수업)
   · phone_click    — tel: 링크 클릭
   · kakao_click    — 카카오 문의 링크 클릭
   · lead_submit    — 폼 유효성 통과 후 제출 시작 시
========================================================== */

(() => {
  if (window.__bal_main_inited__) return;
  window.__bal_main_inited__ = true;

  /* BAL 네임스페이스 (common.js 가 먼저 로드됨) */
  const BAL   = window.BAL;
  const modal = BAL?.modal;

  /* 추적 함수 (analytics.js 가 먼저 로드됨) */
  const track       = window.trackBookLabEvent  || function () {};
  const trackNav    = window.trackBeforeNavigate || function (e, p, h, t) { if (h) { if (t) window.open(h,'_blank','noopener,noreferrer'); else location.href = h; } };

  /* =========================================================
     0) landing_view — 페이지 진입 시 1회
  ========================================================= */
  track('landing_view', {}, { onlyOnce: true });

  /* =========================================================
     1) Scroll Progress Bar
  ========================================================= */
  const progressBar = document.getElementById('progress');
  const updateProgress = () => {
    if (!progressBar) return;
    const h = document.documentElement;
    const denom = (h.scrollHeight - h.clientHeight) || 1;
    progressBar.style.width = (h.scrollTop / denom * 100) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* =========================================================
     2) 전화 버튼 추적
        #btn-phone (a href="tel:...")
  ========================================================= */
  const phoneBtn = document.getElementById('btn-phone');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = phoneBtn.getAttribute('href') || 'tel:01040941666';
      trackNav('phone_click', {
        location:    'contact',
        method:      'phone',
        button_text: phoneBtn.textContent.trim()
      }, href, false);
    });
  }

  /* =========================================================
     3) SMS 버튼 (상담 양식 문자 보내기)
        #sms-consult
  ========================================================= */
  const PHONE_NUMBER = '01040941666';

  const smsBtn        = document.getElementById('sms-consult');
  const smsModal      = document.getElementById('sms-modal');
  const smsTemplateEl = document.getElementById('sms-template');
  const copyBtn       = document.getElementById('copy-sms');
  const copyToast     = document.getElementById('copy-toast');

  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const smsTemplate =
`[책모험 연구소 1:1 상담 신청]
학생 이름:
학부모 성함:
연락처(휴대폰):
연락 가능한 시간대: (오전/늦은 오후/저녁)
개인정보 수집·이용 동의: (동의/미동의)

추가로 나누고 싶은 이야기:`;

  if (smsTemplateEl) smsTemplateEl.value = smsTemplate;

  const buildSmsHref = (bodyText) => {
    const encoded = encodeURIComponent(bodyText || '');
    return /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `sms:${PHONE_NUMBER}&body=${encoded}`
      : `sms:${PHONE_NUMBER}?body=${encoded}`;
  };

  const openSmsModal  = () => {
    if (!smsModal) return;
    smsModal.classList.add('is-open');
    smsModal.setAttribute('aria-hidden', 'false');
  };
  const closeSmsModal = () => {
    if (!smsModal) return;
    smsModal.classList.remove('is-open');
    smsModal.setAttribute('aria-hidden', 'true');
    if (copyToast) copyToast.style.display = 'none';
  };

  if (smsBtn) {
    smsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      /* SMS 버튼도 consult_click 으로 추적 */
      track('consult_click', {
        location:     'contact',
        button_text:  smsBtn.textContent.trim(),
        inquiry_type: 'sms'
      });
      if (isMobile()) window.location.href = buildSmsHref(smsTemplate);
      else openSmsModal();
    });
  }

  if (smsModal) {
    smsModal.addEventListener('click', (e) => {
      if (e.target?.getAttribute?.('data-close') === '1') closeSmsModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && smsModal.classList.contains('is-open')) closeSmsModal();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(smsTemplate);
      } catch {
        if (smsTemplateEl) { smsTemplateEl.focus(); smsTemplateEl.select(); document.execCommand('copy'); }
      }
      if (copyToast) {
        copyToast.style.display = 'block';
        setTimeout(() => (copyToast.style.display = 'none'), 1200);
      }
    });
  }

  /* =========================================================
     4) 카카오 문의 버튼 추적
        #btn-kakao (data-kakao-link 속성에 실제 URL)
  ========================================================= */
  const kakaoBtn = document.getElementById('btn-kakao');
  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = kakaoBtn.getAttribute('data-kakao-link') || '';

      /* ─── TODO: 실제 카카오 채널/오픈채팅 URL을 data-kakao-link 속성에 넣으세요 ─── */
      if (!href || href.includes('PLACEHOLDER')) {
        modal?.open?.({
          title: '안내',
          body: '카카오 문의 링크가 아직 설정되지 않았습니다.\nindex.html의 #btn-kakao data-kakao-link 속성에 실제 URL을 넣어주세요.',
          actions: [{ label: '확인', className: 'primary', closeOnClick: true }]
        });
        return;
      }

      trackNav('kakao_click', {
        location: 'contact',
        method:   'kakao',
        button_text: kakaoBtn.textContent.trim()
      }, href, true); /* 새 탭으로 열기 */
    });
  }

  /* =========================================================
     5) 히어로 CTA 버튼 추적
        #btn-hero-trial, #btn-hero-consult
  ========================================================= */
  const heroCTAs = [
    { id: 'btn-hero-trial',   inquiry_type: 'trial',   location: 'hero' },
    { id: 'btn-hero-consult', inquiry_type: 'consult',  location: 'hero' }
  ];
  heroCTAs.forEach(({ id, inquiry_type, location }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      track('consult_click', {
        location,
        inquiry_type,
        button_text: btn.textContent.trim()
      });
    });
  });

  /* =========================================================
     6) Soft CTA 버튼 추적
        #btn-soft-cta-test, #btn-soft-cta-contact
  ========================================================= */
  const softCTAs = [
    { id: 'btn-soft-cta-test',    inquiry_type: 'test',    location: 'soft_cta' },
    { id: 'btn-soft-cta-contact', inquiry_type: 'consult', location: 'soft_cta' }
  ];
  softCTAs.forEach(({ id, inquiry_type, location }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      track('consult_click', { location, inquiry_type, button_text: btn.textContent.trim() });
    });
  });

  /* =========================================================
     7) Floating CTA 추적
        #floating-cta-link
  ========================================================= */
  const floatingCTA  = document.getElementById('floating-cta');
  const floatingLink = document.getElementById('floating-cta-link');
  const contactSection = document.getElementById('contact');

  if (floatingLink) {
    floatingLink.addEventListener('click', () => {
      track('consult_click', {
        location:     'floating',
        inquiry_type: 'consult',
        button_text:  floatingLink.textContent.trim()
      });
    });
  }

  /* Floating CTA 표시/숨김 (모바일) */
  if (floatingCTA && window.innerWidth < 768) {
    const SHOW_START = 1600;
    const SHOW_END   = 3400;
    const FIT_START  = 3000;
    const SCROLL_STOP_DELAY = 220;
    let scrollTimer = null;

    const handleFloating = () => {
      const y = window.scrollY;

      if (contactSection) {
        const top = contactSection.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.6) { floatingCTA.classList.remove('show'); return; }
      }

      floatingCTA.classList.remove('show');

      if (floatingLink) {
        floatingLink.textContent = (y > FIT_START)
          ? '우리 아이, 이 수업에 맞을까요?'
          : '아이에게 맞는지 먼저 확인해보기';
      }

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (y > SHOW_START && y < SHOW_END) floatingCTA.classList.add('show');
      }, SCROLL_STOP_DELAY);
    };

    document.addEventListener('scroll', handleFloating, { passive: true });
    handleFloating();
  }

  /* =========================================================
     8) 상담 신청 폼 (Netlify Forms)
        #consult-form
        · 유효성 검사 → lead_submit → sessionStorage 마킹 → 제출
  ========================================================= */
  const consultForm = document.getElementById('consult-form');
  const formError   = document.getElementById('form-error');
  const submitBtn   = document.getElementById('form-submit-btn');

  if (consultForm) {

    /* 에러 메시지 표시 헬퍼 */
    const showError = (msg) => {
      if (!formError) return;
      formError.textContent = msg;
      formError.hidden = false;
      formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    const clearError = () => {
      if (formError) formError.hidden = true;
    };

    /* 개별 필드 에러 표시/해제 */
    const markError   = (el) => el?.classList.add('is-error');
    const clearField  = (el) => el?.classList.remove('is-error');

    /* 전화번호 정규화: 숫자만 추출 */
    const normalizePhone = (v) => v.replace(/\D/g, '');

    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const parentName   = consultForm.querySelector('#parent-name');
      const grade        = consultForm.querySelector('#grade');
      const phone        = consultForm.querySelector('#phone');
      const inquiryRadio = consultForm.querySelector('input[name="inquiry_type"]:checked');
      const privacyCheck = consultForm.querySelector('#privacy-agree');

      let valid = true;

      /* 필드 초기화 */
      [parentName, grade, phone].forEach(clearField);

      /* 보호자 성함 */
      if (!parentName?.value.trim()) {
        markError(parentName); valid = false;
      }

      /* 학년 */
      if (!grade?.value) {
        markError(grade); valid = false;
      }

      /* 연락처: 10~11자리 숫자 */
      const rawPhone = normalizePhone(phone?.value || '');
      if (!rawPhone || rawPhone.length < 10 || rawPhone.length > 11) {
        markError(phone); valid = false;
      }

      /* 문의 유형 */
      if (!inquiryRadio) {
        valid = false;
      }

      /* 개인정보 동의 */
      if (!privacyCheck?.checked) {
        valid = false;
      }

      if (!valid) {
        showError('필수 항목을 모두 입력하고 개인정보 수집에 동의해 주세요.');
        return;
      }

      /* ── lead_submit 이벤트 ── */
      track('lead_submit', {
        form_name:    'consult',
        inquiry_type: inquiryRadio.value,
        grade:        grade.value
        /* 이름/전화번호는 payload에 포함하지 않음 (개인정보 보호) */
      });

      /* thanks 페이지에서 lead_complete 가 1회만 발생하도록 마킹 */
      try { sessionStorage.setItem('bl_submitted', '1'); } catch {}

      /* 제출 버튼 비활성화 (이중 제출 방지) */
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '제출 중…'; }

      /* Netlify Forms 제출 (fetch AJAX 방식 → 직접 리다이렉트) */
      const data = new FormData(consultForm);
      /* 전화번호 정규화 후 재주입 */
      data.set('phone', rawPhone);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
        .then(() => {
          window.location.href = '/thanks/';
        })
        .catch(() => {
          /* fetch 실패 시 일반 폼 제출로 fallback */
          consultForm.submit();
        });
    });
  }

  /* =========================================================
     9) 탭 전환 (수업 안내 섹션)
  ========================================================= */
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* =========================================================
     10) Footer: Threads (공용 모달)
  ========================================================= */
  const threadsBtn = document.getElementById('btn-threads');

  if (threadsBtn) {
    threadsBtn.addEventListener('click', (e) => {
      const link = threadsBtn.getAttribute('data-link') || '';
      if (!link || link === 'THREADS_URL') {
        e.preventDefault();
        modal?.open?.({
          title: '안내',
          body: 'Threads 링크가 아직 설정되지 않았습니다.\nindex.html에서 data-link 값을 실제 주소로 바꿔주세요.',
          actions: [{ label: '확인', className: 'primary', closeOnClick: true }]
        });
        return;
      }
      threadsBtn.setAttribute('href', link);
    }, { passive: false });
  }

})();

/* ==========================================================
   수업 전경 슬라이더 (PC: 3장씩 / Mobile: 1장씩)
========================================================== */
(() => {
  if (window.__bal_scene_slider_inited__) return;
  window.__bal_scene_slider_inited__ = true;

  const slider = document.getElementById('scene-slider');
  if (!slider) return;

  const track    = slider.querySelector('.slider-track');
  if (!track) return;

  const prevBtn  = slider.querySelector('.slider-btn.prev');
  const nextBtn  = slider.querySelector('.slider-btn.next');
  const mq       = window.matchMedia('(max-width: 768px)');
  const origHTML = track.innerHTML;

  let index = 0;

  const slides     = () => Array.from(track.querySelectorAll('.slide'));
  const slideCount = () => slides().length;

  const update = () => {
    const c = slideCount();
    if (!c) return;
    if (index < 0) index = c - 1;
    if (index >= c) index = 0;
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  };

  const buildMobile = () => {
    if (track.dataset.mode === 'mobile') return;
    const imgs = Array.from(track.querySelectorAll('img'))
      .map(img => ({ src: img.getAttribute('src') || '', alt: img.getAttribute('alt') || '' }))
      .filter(x => x.src);
    track.innerHTML = imgs.map(it =>
      `<div class="slide"><img src="${it.src}" alt="${it.alt}" loading="lazy"></div>`
    ).join('');
    track.dataset.mode = 'mobile';
    index = 0;
    update();
  };

  const buildPC = () => {
    if (track.dataset.mode === 'pc') return;
    track.innerHTML = origHTML;
    track.dataset.mode = 'pc';
    index = 0;
    update();
  };

  const applyMode = () => mq.matches ? buildMobile() : buildPC();

  nextBtn?.addEventListener('click', () => { index += 1; update(); });
  prevBtn?.addEventListener('click', () => { index -= 1; update(); });

  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches?.[0]?.clientX ?? 0; }, { passive: true });
  slider.addEventListener('touchend',   (e) => {
    const dx = (e.changedTouches?.[0]?.clientX ?? 0) - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? (index += 1, update()) : (index -= 1, update()); }
  }, { passive: true });

  if (mq.addEventListener) mq.addEventListener('change', applyMode);
  else if (mq.addListener) mq.addListener(applyMode);

  window.addEventListener('resize', applyMode);

  track.dataset.mode = '';
  applyMode();
})();
