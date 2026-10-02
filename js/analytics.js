(() => {
  const config = window.PORTFOLIO_ANALYTICS || {};
  const ga4Id = typeof config.ga4Id === 'string' ? config.ga4Id.trim() : '';
  const clarityId = typeof config.clarityId === 'string' ? config.clarityId.trim() : '';
  const analyticsEnabled = Boolean(ga4Id || clarityId);
  const consentKey = 'fs-analytics-consent';
  const banner = document.getElementById('privacyBanner');
  let activated = false;

  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const campaign = Object.fromEntries(
    campaignKeys.map((key) => [key, new URLSearchParams(window.location.search).get(key) || ''])
  );

  window.portfolioCampaign = {
    ...campaign,
    landing_page: window.location.pathname + window.location.search
  };

  function loadGoogleAnalytics() {
    if (!ga4Id || document.querySelector('script[data-portfolio-ga4]')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.dataset.portfolioGa4 = 'true';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4Id);
    document.head.appendChild(script);
  }

  function loadClarity() {
    if (!clarityId || document.querySelector('script[data-portfolio-clarity]')) return;
    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    window.clarity('consent');

    const script = document.createElement('script');
    script.async = true;
    script.dataset.portfolioClarity = 'true';
    script.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(clarityId);
    document.head.appendChild(script);
  }

  function activateAnalytics() {
    if (activated || !analyticsEnabled) return;
    activated = true;
    loadGoogleAnalytics();
    loadClarity();

    if (document.body.classList.contains('case-page')) {
      window.portfolioTrack('view_case_study', { project: 'central_servicos_ti' });
    }
  }

  function setConsent(value) {
    localStorage.setItem(consentKey, value);
    banner?.setAttribute('hidden', '');
    if (value === 'granted') activateAnalytics();
  }

  window.portfolioTrack = (eventName, parameters = {}) => {
    if (!activated || typeof eventName !== 'string') return;

    const safeParameters = {
      page_path: window.location.pathname,
      ...parameters
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, safeParameters);
    }
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName);
    }
  };

  if (!analyticsEnabled) {
    document.documentElement.classList.add('analytics-disabled');
    return;
  }

  const storedConsent = localStorage.getItem(consentKey);
  if (storedConsent === 'granted') {
    activateAnalytics();
  } else if (storedConsent !== 'denied') {
    banner?.removeAttribute('hidden');
  }

  document.querySelectorAll('[data-consent]').forEach((button) => {
    button.addEventListener('click', () => setConsent(button.dataset.consent));
  });

  document.querySelectorAll('[data-privacy-settings]').forEach((button) => {
    button.addEventListener('click', () => banner?.removeAttribute('hidden'));
  });

  document.addEventListener('click', (event) => {
    const tracked = event.target.closest('[data-track]');
    if (!tracked) return;
    window.portfolioTrack('cta_click', { location: tracked.dataset.track });
  });

  let formStarted = false;
  const contactForm = document.getElementById('cform');
  contactForm?.addEventListener('input', () => {
    if (formStarted) return;
    formStarted = true;
    window.portfolioTrack('form_start', { form_name: 'project_contact' });
  });

  const scrollMarks = new Set();
  window.addEventListener('scroll', () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (documentHeight <= 0) return;
    const percentage = Math.round((window.scrollY / documentHeight) * 100);
    [50, 90].forEach((mark) => {
      if (percentage >= mark && !scrollMarks.has(mark)) {
        scrollMarks.add(mark);
        window.portfolioTrack('scroll_depth', { percent: mark });
      }
    });
  }, { passive: true });
})();
