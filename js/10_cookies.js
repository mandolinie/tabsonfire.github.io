// cookies.js
function initCookies() {
  const overlay = document.getElementById('cookies');
  const acceptBtn = document.getElementById('cookiesAcceptButton');
  const declineBtn = document.getElementById('cookiesDeclineButton');

  if (!overlay || !acceptBtn || !declineBtn) return;

  const STORAGE_KEY = 'TabsOnFire 🔥🗂️ Cookies';
  const GA_ID = 'G-43C8S7QD4X';

  // Google Analytics loader
  function loadGoogleAnalytics() {
    if (window.gtag) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // Single source of truth for changing decision
  function setDecision(value) {
    localStorage.setItem(STORAGE_KEY, value);

    if (value === 'accepted') {
      loadGoogleAnalytics();
    }

    document.dispatchEvent(
      new CustomEvent('cookies:change', {
        detail: { value }
      })
    );
  }

  const decision = localStorage.getItem(STORAGE_KEY);

  // Initial behavior
  if (!decision) {
    overlay.style.display = 'block';
  } else {
    overlay.style.display = 'none';

    if (decision === 'accepted') {
      loadGoogleAnalytics();
    }
  }

  // Modal actions
  acceptBtn.addEventListener('click', () => {
    setDecision('accepted');
    overlay.style.display = 'none';
  });

  declineBtn.addEventListener('click', () => {
    setDecision('declined');
    overlay.style.display = 'none';
  });

  // Public API (for settings page & future use)
  window.cookies = {
    get() {
      return localStorage.getItem(STORAGE_KEY);
    },
    accept() {
      setDecision('accepted');
    },
    decline() {
      setDecision('declined');
    },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
      overlay.style.display = 'block';
    }
  };
}
