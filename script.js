
(() => {
    if (window.__bal_inited__) return;
  window.__bal_inited__ = true;
  
  /* Footer Year */
  const yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Scroll Progress Bar */
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

  /* SMS / TEL Actions */
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
학년/연령:
학부모 성함:
연락처(휴대폰):
연락 가능한 시간대: (오전/늦은 오후/저녁)
개인정보 수집·이용 동의: (동의/미동의)

추가로 나누고 싶은 이야기:`;

  if (smsTemplateEl) smsTemplateEl.value = smsTemplate;

  const buildSmsHref = () => {
    const encoded = encodeURIComponent(smsTemplate);
    // iOS도 번호 포함이 안정적
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
      if (isMobile()) window.location.href = buildSmsHref();
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

  /* Floating CTA (Mobile) */
  const floatingCTA = document.getElementById('floating-cta');
  const floatingLink = document.getElementById('floating-cta-link');
  const contactSection = document.getElementById('contact');

  if (floatingCTA && window.innerWidth < 768) {
    const SHOW_START = 1600;
    const SHOW_END   = 3400;
    const FIT_START  = 3000;
    const SCROLL_STOP_DELAY = 220;

    let scrollTimer = null;

    const handleFloating = () => {
      const y = window.scrollY;

      // Contact 섹션 근처면 숨김
      if (contactSection) {
        const contactTop = contactSection.getBoundingClientRect().top;
        if (contactTop < window.innerHeight * 0.6) {
          floatingCTA.classList.remove('show');
          return;
        }
      }

      // 스크롤 중 숨김
      floatingCTA.classList.remove('show');

      // 문구 즉시 갱신
      if (floatingLink) {
        floatingLink.textContent = (y > FIT_START)
          ? '우리 아이, 이 수업에 맞을까요?'
          : '아이에게 맞는지 먼저 확인해보기';
      }

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (y > SHOW_START && y < SHOW_END) {
          floatingCTA.classList.add('show');
        }
      }, SCROLL_STOP_DELAY);
    };

    document.addEventListener('scroll', handleFloating, { passive: true });
    handleFloating();
  }
})();

document.querySelectorAll('.y').forEach(el => {
  el.textContent = new Date().getFullYear();
});
