/**
 * skimmelfri.dk – Main site JavaScript
 * ======================================
 * Handles:
 *  - Mobile navigation toggle
 *  - Search overlay toggle + basic client-side search
 *  - Active nav link highlighting
 *  - Footer year update
 *  - Smooth anchor scrolling for ToC links
 */

(function () {
  'use strict';

  // -------------------------------------------------------
  // Utility: debounce
  // -------------------------------------------------------
  function debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      var ctx  = this;
      var args = arguments;
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  // -------------------------------------------------------
  // Mobile navigation toggle
  // -------------------------------------------------------
  function initMobileNav() {
    var toggle  = document.getElementById('menuToggle');
    var nav     = document.getElementById('mobileNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      nav.setAttribute('aria-hidden', String(!isOpen));

      // Swap icon between hamburger ↔ close
      var svgLines = toggle.querySelectorAll('line');
      if (isOpen) {
        // Show X
        if (svgLines.length === 3) {
          toggle.querySelector('svg').innerHTML =
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
        }
        toggle.setAttribute('aria-label', 'Luk menu');
      } else {
        toggle.querySelector('svg').innerHTML =
          '<line x1="3" y1="12" x2="21" y2="12"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<line x1="3" y1="18" x2="21" y2="18"/>';
        toggle.setAttribute('aria-label', 'Åbn menu');
      }
    });

    // Close mobile nav when a link is clicked
    nav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // -------------------------------------------------------
  // Search overlay
  // -------------------------------------------------------
  function initSearch() {
    var searchToggle  = document.getElementById('searchToggle');
    var searchOverlay = document.getElementById('searchOverlay');
    var searchClose   = document.getElementById('searchClose');
    var searchInput   = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');

    if (!searchToggle || !searchOverlay) return;

    function openSearch() {
      searchOverlay.classList.add('is-open');
      searchOverlay.setAttribute('aria-hidden', 'false');
      searchToggle.setAttribute('aria-expanded', 'true');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(function () { searchInput.focus(); }, 50);
      }
      if (searchResults) {
        searchResults.innerHTML = '<p class="search-box__hint">Skriv for at søge efter artikler og emner</p>';
      }
    }

    function closeSearch() {
      searchOverlay.classList.remove('is-open');
      searchOverlay.setAttribute('aria-hidden', 'true');
      searchToggle.setAttribute('aria-expanded', 'false');
      if (searchToggle) searchToggle.focus();
    }

    searchToggle.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Close on overlay background click
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });

    // Close on Escape (search overlay – complement to cookie modal escape)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
        closeSearch();
      }
    });

    // Basic client-side search
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function () {
        var query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
          searchResults.innerHTML = '<p class="search-box__hint">Skriv mindst 2 tegn for at søge</p>';
          return;
        }
        runSearch(query);
      }, 200));
    }
  }

  // -------------------------------------------------------
  // Search index – populate as articles are added
  // -------------------------------------------------------
  var SEARCH_INDEX = [
    { title: 'Forebyg skimmelsvamp',        url: '/skimmelfri.dk/forebyg/',        keywords: 'forebyg forebyggelse ventilation udluftning fugt temperatur' },
    { title: 'Find skimmelsvamp',            url: '/skimmelfri.dk/find/',           keywords: 'find opdage tegn symptomer test testmetoder luftmåling' },
    { title: 'Fjern skimmelsvamp',           url: '/skimmelfri.dk/fjern/',          keywords: 'fjern bekæmp fjernelse rengøring sanering professionel' },
    { title: 'Ressourcer',                   url: '/skimmelfri.dk/ressourcer/',     keywords: 'ressourcer kilder links sundhedsstyrelsen bolius skimmel cisbo' },
    { title: 'Produkter og udstyr',          url: '/skimmelfri.dk/produkter/',      keywords: 'produkter hygrometer affugter ventilation hepa støvsuger' },
    { title: 'Om siden',                     url: '/skimmelfri.dk/om/',             keywords: 'om side forfatter morten non-profit uvildig' },
    { title: 'Privatlivspolitik',            url: '/skimmelfri.dk/privatlivspolitik/', keywords: 'privatliv gdpr cookies data politik' },
    { title: 'Ventilation og udluftning',    url: '/skimmelfri.dk/forebyg/ventilation/', keywords: 'ventilation udluftning gennemtræk vindue luftudskiftning sundhedsstyrelsen' },
    { title: 'Opvarmning og fugt',           url: '/skimmelfri.dk/forebyg/opvarmning-og-fugt/', keywords: 'temperatur opvarmning fugt 18 grader luftfugtighed' },
    { title: 'Daglige vaner',                url: '/skimmelfri.dk/forebyg/daglige-vaner/', keywords: 'tøj tørre bad køkken emhætte vaner daglig' },
    { title: 'Rengøring og indeklimavaner',  url: '/skimmelfri.dk/forebyg/rengoering/', keywords: 'rengøring støvsugning hepa miljøvenlig ugentlig' },
    { title: 'Hvad er skimmelsvamp?',        url: '/skimmelfri.dk/forebyg/hvad-er-skimmelsvamp/', keywords: 'hvad er skimmelsvamp svamp organismer sundhed' },
    { title: 'Tegn på skimmelsvamp',         url: '/skimmelfri.dk/find/tegn/',      keywords: 'tegn muglugt pletter kondens misfarvning fugt' },
    { title: 'Helbredssymptomer',            url: '/skimmelfri.dk/find/helbredssymptomer/', keywords: 'helbred symptomer astma allergi luftveje hovedpine' },
    { title: 'Testmetoder',                  url: '/skimmelfri.dk/find/testmetoder/', keywords: 'test testmetoder aftryksplader mycometer dna luftmåling laboratorium' },
    { title: 'Skjult skimmelsvamp',          url: '/skimmelfri.dk/find/skjult-skimmel/', keywords: 'skjult skimmel gulv loft isolering vægge bag' },
    { title: 'Hvornår skal du reagere?',     url: '/skimmelfri.dk/fjern/hvornaar-reagere/', keywords: 'reagere hvornår størrelse 20 cm professionel' },
    { title: 'Fjern mindre angreb selv',     url: '/skimmelfri.dk/fjern/mindre-angreb/', keywords: 'fjern lille angreb selv rengøring vask skrub' },
    { title: 'Større angreb og sanering',    url: '/skimmelfri.dk/fjern/stoerre-angreb/', keywords: 'større angreb sanering professionel støvskillevæg afrensning' },
    { title: 'Forsikring og hjælp',          url: '/skimmelfri.dk/fjern/forsikring/', keywords: 'forsikring hjælp vandskade ejerskifteforsikring' }
  ];

  function runSearch(query) {
    var results = SEARCH_INDEX.filter(function (item) {
      return (item.title.toLowerCase().indexOf(query) !== -1) ||
             (item.keywords.indexOf(query) !== -1);
    });

    var container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<p class="search-box__hint">Ingen resultater for "' + escapeHtml(query) + '"</p>';
      return;
    }

    var html = '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:4px;">';
    results.forEach(function (item) {
      html += '<li>' +
        '<a href="' + item.url + '" style="' +
          'display:block;padding:10px 12px;border-radius:6px;text-decoration:none;' +
          'color:var(--color-text);font-size:var(--text-sm);transition:background-color 150ms ease;' +
        '" onmouseover="this.style.backgroundColor=\'var(--color-bg-subtle)\'" ' +
           'onmouseout="this.style.backgroundColor=\'transparent\'">' +
        escapeHtml(item.title) +
        '</a></li>';
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -------------------------------------------------------
  // Active navigation link
  // -------------------------------------------------------
  function initActiveNav() {
    var path = window.location.pathname;

    // Desktop nav
    document.querySelectorAll('.site-nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      // Match exact path or section prefix
      if (path === href || (href !== '/' && path.indexOf(href) === 0)) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Mobile nav
    document.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (path === href || (href !== '/' && path.indexOf(href) === 0)) {
        link.classList.add('is-active');
      }
    });
  }

  // -------------------------------------------------------
  // Current year in footer
  // -------------------------------------------------------
  function initYear() {
    document.querySelectorAll('#currentYear').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // -------------------------------------------------------
  // Smooth scroll for in-page anchor links (ToC)
  // -------------------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var headerHeight = 70; // sticky header offset
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  // -------------------------------------------------------
  // Bootstrap
  // -------------------------------------------------------
  function init() {
    initMobileNav();
    initSearch();
    initActiveNav();
    initYear();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
