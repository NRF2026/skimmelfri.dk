/**
 * skimmelfri.dk – GDPR Cookie Consent
 * =====================================
 * Compliant with:
 *  - EU GDPR (Regulation 2016/679)
 *  - Danish Cookiebekendtgørelsen (BEK nr. 1148 af 09/12/2011)
 *  - Datatilsynet / Digitaliseringsstyrelsen vejledning
 *
 * Principles implemented:
 *  - No cookies set before consent (except strictly necessary)
 *  - No pre-ticked boxes
 *  - Equal prominence of Accept / Reject options
 *  - Consent is freely given, specific, informed and unambiguous
 *  - Easy withdrawal – available from footer at all times
 *  - Consent stored locally (localStorage) – no server-side logging
 *  - Marketing category disabled entirely (non-profit site)
 */

(function () {
  'use strict';

  var CONSENT_KEY     = 'sk_consent';
  var CONSENT_VERSION = '1';

  // -------------------------------------------------------
  // Consent state
  // -------------------------------------------------------
  var state = {
    necessary: true,   // always true – cannot be toggled
    statistics: false,
    marketing: false,  // always false – disabled on this site
    version: CONSENT_VERSION,
    timestamp: null
  };

  // -------------------------------------------------------
  // Persistence helpers
  // -------------------------------------------------------
  function loadConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      // Invalidate if version changed
      if (!parsed || parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consentObj) {
    try {
      consentObj.version   = CONSENT_VERSION;
      consentObj.timestamp = new Date().toISOString();
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentObj));
    } catch (e) {
      // localStorage unavailable – degrade gracefully
    }
  }

  // -------------------------------------------------------
  // Cookie helpers (for actual cookie setting if needed)
  // -------------------------------------------------------
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) +
      expires + '; path=/; SameSite=Lax; Secure';
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }

  // -------------------------------------------------------
  // Statistics activation (placeholder – replace with your
  // actual analytics loader when statistics are enabled)
  // -------------------------------------------------------
  function activateStatistics() {
    // Example: load Plausible (privacy-friendly, no personal data)
    // Only called AFTER the user has given explicit consent.
    //
    // if (typeof window._plausible === 'undefined') {
    //   var s = document.createElement('script');
    //   s.defer = true;
    //   s.dataset.domain = 'skimmelfri.dk';
    //   s.src = 'https://plausible.io/js/script.js';
    //   document.head.appendChild(s);
    // }
    //
    // Currently a no-op until analytics are configured.
    if (window.console && window.console.log) {
      // console.log('[CookieConsent] Statistics activated');
    }
  }

  function deactivateStatistics() {
    // Remove any statistics cookies if previously set
    deleteCookie('_plausible');
  }

  // -------------------------------------------------------
  // Apply consent state to the page
  // -------------------------------------------------------
  function applyConsent(consentObj) {
    state.necessary  = true;
    state.statistics = !!consentObj.statistics;
    state.marketing  = false;

    if (state.statistics) {
      activateStatistics();
    } else {
      deactivateStatistics();
    }

    // Sync the toggle in the modal if it exists
    var statsToggle = document.getElementById('statsConsent');
    if (statsToggle) {
      statsToggle.checked = state.statistics;
    }

    // Dispatch custom event so other scripts can react
    document.dispatchEvent(new CustomEvent('consentUpdated', { detail: state }));
  }

  // -------------------------------------------------------
  // Banner visibility
  // -------------------------------------------------------
  function showBanner() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.setAttribute('aria-hidden', 'false');
    // Use rAF so the CSS transition plays
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('is-visible');
      });
    });
  }

  function hideBanner() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
    // Remove from tab order after transition
    setTimeout(function () {
      if (!banner.classList.contains('is-visible')) {
        banner.style.display = 'none';
      }
    }, 400);
  }

  // -------------------------------------------------------
  // Modal visibility
  // -------------------------------------------------------
  function openModal() {
    var overlay = document.getElementById('cookieModal');
    if (!overlay) return;

    // Sync toggle state before opening
    var statsToggle = document.getElementById('statsConsent');
    if (statsToggle) {
      statsToggle.checked = state.statistics;
    }

    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('is-visible');
      });
    });

    // Focus management
    var firstFocusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(function () { firstFocusable.focus(); }, 50);
    }

    // Trap focus within modal
    overlay.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    var overlay = document.getElementById('cookieModal');
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var overlay = document.getElementById('cookieModal');
    if (!overlay) return;
    var focusable = overlay.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // -------------------------------------------------------
  // Consent actions
  // -------------------------------------------------------
  function acceptAll() {
    var c = { necessary: true, statistics: true, marketing: false };
    saveConsent(c);
    applyConsent(c);
    hideBanner();
    closeModal();
  }

  function rejectAll() {
    var c = { necessary: true, statistics: false, marketing: false };
    saveConsent(c);
    applyConsent(c);
    hideBanner();
    closeModal();
  }

  function savePreferences() {
    var statsToggle = document.getElementById('statsConsent');
    var c = {
      necessary:  true,
      statistics: statsToggle ? statsToggle.checked : false,
      marketing:  false
    };
    saveConsent(c);
    applyConsent(c);
    hideBanner();
    closeModal();
  }

  // -------------------------------------------------------
  // Wire up DOM event listeners
  // -------------------------------------------------------
  function bindEvents() {
    // Banner buttons
    var acceptBtn   = document.getElementById('cookieAcceptBtn');
    var rejectBtn   = document.getElementById('cookieRejectBtn');
    var settingsBtn = document.getElementById('cookieSettingsBtn');

    if (acceptBtn)   acceptBtn.addEventListener('click', acceptAll);
    if (rejectBtn)   rejectBtn.addEventListener('click', rejectAll);
    if (settingsBtn) settingsBtn.addEventListener('click', function () {
      openModal();
      hideBanner();
    });

    // Modal buttons
    var modalAcceptAll = document.getElementById('modalAcceptAll');
    var modalRejectAll = document.getElementById('modalRejectAll');
    var modalSavePrefs = document.getElementById('modalSavePrefs');
    var modalClose     = document.getElementById('cookieModalClose');

    if (modalAcceptAll) modalAcceptAll.addEventListener('click', acceptAll);
    if (modalRejectAll) modalRejectAll.addEventListener('click', rejectAll);
    if (modalSavePrefs) modalSavePrefs.addEventListener('click', savePreferences);
    if (modalClose)     modalClose.addEventListener('click', closeModal);

    // Close modal on overlay click (outside modal box)
    var overlay = document.getElementById('cookieModal');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Footer "Cookie-indstillinger" button (may appear on every page)
    var footerSettingsBtn = document.getElementById('openCookieSettings');
    if (footerSettingsBtn) {
      footerSettingsBtn.addEventListener('click', function () {
        openModal();
      });
    }
  }

  // -------------------------------------------------------
  // Initialisation
  // -------------------------------------------------------
  function init() {
    var saved = loadConsent();

    if (saved) {
      // Returning visitor – apply saved preferences silently
      applyConsent(saved);
    } else {
      // First visit – show banner (no cookies set until action taken)
      showBanner();
    }

    bindEvents();
  }

  // -------------------------------------------------------
  // Public API (available as window.CookieConsent)
  // -------------------------------------------------------
  window.CookieConsent = {
    openModal:       openModal,
    closeModal:      closeModal,
    acceptAll:       acceptAll,
    rejectAll:       rejectAll,
    savePreferences: savePreferences,
    getState:        function () { return Object.assign({}, state); },
    hasConsented:    function (category) { return !!state[category]; }
  };

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
