/* assets/js/pages/home.js */
(() => {
  if (window.__bal_main_inited__) return;
  window.__bal_main_inited__ = true;

  const BAL = window.BAL;
  const modal = BAL?.modal;

  /* =========================================================
     1) Scroll Progress Bar
  ========================================================= */
  const progressBar = document.getElementById('progress');
  const updateProgress = () => {
    if (!progressBar) return;
    const h = document.documentElement;
    const denom = (h.scrollHeight - h.clientHeight) || 1;
    const scrolled = h.scrollTop / denom;
    progressBar.style.width = (scrolled * 100) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* =========================================================
     2) SMS / TEL Actions
  ========================================================= */
  const PHONE_NUMBER = '01040941666';

  const smsBtn = document.getElementById('sms-consult');
  const smsModal = document.getElementById('sms-modal');
  const smsTemplateEl = document.getElementById('sms-template');
  const copyBtn = document.getElementById('copy-sms');
  const copyToast = document.getElementById('copy-toast');

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
    // iOS는 ?body 대신 &body 쓰는 경우가 많음
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return `sms:${PHONE_NUMBER}&body=${encoded}`;
    }
    return `sms:${PHONE_NUMBER}?body=${encoded}`;
  };

  const openSmsModal = () => {
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
      if (isMobile()) window.location.href = buildSmsHref(smsTemplate);
      else openSmsModal();
    });
  }

  if (smsModal) {
    smsModal.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-close') === '1') closeSmsModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && smsModal.classList.contains('is-open')) closeSmsModal();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(smsTemplate);
      } catch (err) {
        if (smsTemplateEl) {
          smsTemplateEl.focus();
          smsTemplateEl.select();
          document.execCommand('copy');
        }
      }
      if (copyToast) {
        copyToast.style.display = 'block';
        setTimeout(() => (copyToast.style.display = 'none'), 1200);
      }
    });
  }

  /* =========================================================
     3) Floating CTA (Mobile)
  ========================================================= */
  const floatingCTA = document.getElementById('floating-cta');
  const floatingLink = document.getElementById('floating-cta-link');
  const contactSection = document.getElementById('contact');

  if (floatingCTA && window.innerWidth < 768) {
    const SHOW_START = 1600;
    const SHOW_END = 3400;
    const FIT_START = 3000;
    const SCROLL_STOP_DELAY = 220;

    let scrollTimer = null;

    const handleFloating = () => {
      const y = window.scrollY;

      if (contactSection) {
        const contactTop = contactSection.getBoundingClientRect().top;
        if (contactTop < window.innerHeight * 0.6) {
          floatingCTA.classList.remove('show');
          return;
        }
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
     4) Footer: Threads / 독서모임 (공용모달로 팝업)
  ========================================================= */
  const threadsBtn = document.getElementById('btn-threads');
  const clubBtn = document.getElementById('btn-reading-club');

  if (threadsBtn) {
    threadsBtn.addEventListener('click', (e) => {
      const link = threadsBtn.getAttribute('data-link') || '';
      if (!link || link === 'THREADS_URL') {
        e.preventDefault();
        modal?.open?.({
          title: '안내',
          body: 'Threads 링크가 아직 설정되지 않았습니다.\nindex.html에서 data-link="THREADS_URL" 부분을 실제 주소로 바꿔주세요.',
          actions: [{ label: '확인', className: 'primary' }]
        });
        return;
      }
      threadsBtn.setAttribute('href', link);
    }, { passive: false });
  }

  if (clubBtn) {
    clubBtn.addEventListener('click', () => {
      const link = clubBtn.getAttribute('data-link') || '';
      if (!link || link === 'READING_CLUB_URL') {
        modal?.open?.({
          title: '안내',
          body: '독서모임 링크가 아직 설정되지 않았습니다.\nindex.html에서 data-link="READING_CLUB_URL" 부분을 실제 주소로 바꿔주세요.',
          actions: [{ label: '확인', className: 'primary' }]
        });
        return;
      }

      modal?.open?.({
        title: '독서모임 안내',
        body: '독서교육 자격증을 가진 전문가가 운영하는 독서모임입니다.\n연결 해드릴까요?',
        actions: [
          { label: '예', className: 'primary', closeOnClick: true, onClick: () => (window.location.href = link) },
          { label: '아니오', closeOnClick: true }
        ]
      });
    });
  }
})();

/* =========================================================
   5) 수업 전경 슬라이더 (PC: 3장씩 / Mobile: 1장씩)
   - HTML: #scene-slider > .slider-track > .slide(각 slide 안에 img 3개)
   - CSS: .slide { flex:0 0 100% } / .slider-track { display:flex }
========================================================= */
(() => {
  // ✅ 이 슬라이더 전용 init flag (다른 슬라이더랑 충돌 방지)
  if (window.__bal_scene_slider_inited__) return;
  window.__bal_scene_slider_inited__ = true;

  const slider = document.getElementById('scene-slider');
  if (!slider) return;

  const track = slider.querySelector('.slider-track');
  if (!track) return;

  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');

  const mq = window.matchMedia('(max-width: 768px)');
  const originalHTML = track.innerHTML; // ✅ PC 원본 백업

  let index = 0;

  const getSlides = () => Array.from(track.querySelectorAll('.slide'));
  const slideCount = () => getSlides().length;

  const clampIndex = () => {
    const c = slideCount();
    if (!c) return;
    if (index < 0) index = c - 1;
    if (index >= c) index = 0;
  };

  const update = () => {
    const c = slideCount();
    if (!c) return;
    clampIndex();
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  };

  // ✅ Mobile: 1장 = 1슬라이드로 재구성 (각 img를 slide로 분리)
  const buildForMobile = () => {
    if (track.dataset.mode === 'mobile') return;

    const imgs = Array.from(track.querySelectorAll('img')).map(img => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || ''
    })).filter(x => x.src);

    track.innerHTML = imgs.map(it => `
      <div class="slide">
        <img src="${it.src}" alt="${it.alt}" loading="lazy">
      </div>
    `).join('');

    track.dataset.mode = 'mobile';
    index = 0;
    update();
  };

  // ✅ PC: 원본 복원 (3장씩)
  const buildForPC = () => {
    if (track.dataset.mode === 'pc') return;

    track.innerHTML = originalHTML;
    track.dataset.mode = 'pc';
    index = 0;
    update();
  };

  const applyMode = () => {
    if (mq.matches) buildForMobile();
    else buildForPC();
  };

  const next = () => { index += 1; update(); };
  const prev = () => { index -= 1; update(); };

  nextBtn && nextBtn.addEventListener('click', next);
  prevBtn && prevBtn.addEventListener('click', prev);

  // ✅ Touch swipe (mobile)
  let startX = 0;
  slider.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
  }, { passive: true });

  // ✅ iOS Safari matchMedia 호환
  if (mq.addEventListener) mq.addEventListener('change', applyMode);
  else if (mq.addListener) mq.addListener(applyMode);

  // resize 때도 한 번 더(가끔 iOS에서 change가 늦음)
  window.addEventListener('resize', applyMode);

  // init
  track.dataset.mode = '';
  applyMode();
})();

