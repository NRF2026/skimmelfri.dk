/**
 * skimmelinfo.dk – GDPR Cookie Consent
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
 *  - Consent stored as browser cookie (sk_consent, 12 months)
 *  - Marketing category disabled entirely (non-commercial site)
 */

(function () {
  'use strict';

  var CONSENT_KEY     = 'sk_consent';
  var CONSENT_VERSION = '2';
  var CONSENT_DAYS    = 365;

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
  // Cookie helpers
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

  function getCookie(name) {
    var search = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i].trim();
      if (c.indexOf(search) === 0) {
        return decodeURIComponent(c.substring(search.length));
      }
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
  }

  // -------------------------------------------------------
  // Persistence helpers
  // -------------------------------------------------------
  function loadConsent() {
    // Try browser cookie (current format)
    try {
      var raw = getCookie(CONSENT_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.version === CONSENT_VERSION) {
          return parsed;
        }
        // Outdated version – delete and re-ask
        deleteCookie(CONSENT_KEY);
        return null;
      }
    } catch (e) {
      deleteCookie(CONSENT_KEY);
    }

    // Migrate from localStorage (used in v1 – can be removed after 12 months)
    try {
      var lsRaw = localStorage.getItem(CONSENT_KEY);
      if (lsRaw) {
        var lsParsed = JSON.parse(lsRaw);
        localStorage.removeItem(CONSENT_KEY);
        if (lsParsed && (lsParsed.version === '1' || lsParsed.version === CONSENT_VERSION)) {
          // Migrate to cookie
          var migrated = {
            necessary:  true,
            statistics: !!lsParsed.statistics,
            marketing:  false
          };
          saveConsent(migrated);
          return migrated;
        }
      }
    } catch (e) { /* ignore */ }

    return null;
  }

  function saveConsent(consentObj) {
    consentObj.version   = CONSENT_VERSION;
    consentObj.timestamp = new Date().toISOString();
    try {
      setCookie(CONSENT_KEY, JSON.stringify(consentObj), CONSENT_DAYS);
    } catch (e) {
      // Cookie setting failed – degrade gracefully
    }
  }

  // -------------------------------------------------------
  // Statistics activation (placeholder – replace with your
  // actual analytics loader when statistics are enabled)
  // -------------------------------------------------------
  function activateStatistics() {
    // Plausible Analytics – privacy-friendly, no personal data, no cookies.
    // Only called AFTER the user has given explicit consent for statistics.
    if (typeof window.plausible !== 'undefined') return; // already loaded

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://plausible.io/js/pa-U6QFwBVSv_M5_wkZR-WD1.js';
    document.head.appendChild(s);

    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    window.plausible.init = window.plausible.init || function (i) {
      window.plausible.o = i || {};
    };
    window.plausible.init();
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

    var firstFocusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(function () { firstFocusable.focus(); }, 50);
    }

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
    var acceptBtn   = document.getElementById('cookieAcceptBtn');
    var rejectBtn   = document.getElementById('cookieRejectBtn');
    var settingsBtn = document.getElementById('cookieSettingsBtn');

    if (acceptBtn)   acceptBtn.addEventListener('click', acceptAll);
    if (rejectBtn)   rejectBtn.addEventListener('click', rejectAll);
    if (settingsBtn) settingsBtn.addEventListener('click', function () {
      openModal();
      hideBanner();
    });

    var modalAcceptAll = document.getElementById('modalAcceptAll');
    var modalRejectAll = document.getElementById('modalRejectAll');
    var modalSavePrefs = document.getElementById('modalSavePrefs');
    var modalClose     = document.getElementById('cookieModalClose');

    if (modalAcceptAll) modalAcceptAll.addEventListener('click', acceptAll);
    if (modalRejectAll) modalRejectAll.addEventListener('click', rejectAll);
    if (modalSavePrefs) modalSavePrefs.addEventListener('click', savePreferences);
    if (modalClose)     modalClose.addEventListener('click', closeModal);

    var overlay = document.getElementById('cookieModal');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

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
      applyConsent(saved);
    } else {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
