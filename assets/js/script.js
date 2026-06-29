'use strict';

(function () {

  // ===== Theme toggle (dark / light) =====
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ===== Mobile menu toggle =====
  const menuBtn = document.getElementById('menuToggle');
  const topnav = document.querySelector('.topnav');
  if (menuBtn && topnav) {
    menuBtn.addEventListener('click', function () {
      const isOpen = topnav.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
    topnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        topnav.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Sticky topbar shadow on scroll =====
  const topbar = document.querySelector('.topbar');
  window.addEventListener('scroll', function () {
    if (!topbar) return;
    if (window.scrollY > 8) topbar.classList.add('scrolled');
    else topbar.classList.remove('scrolled');
  }, { passive: true });

  // ===== Reveal on scroll (Intersection Observer) =====
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ===== Skill bars animation =====
  const bars = document.querySelectorAll('.bar-fill');
  if ('IntersectionObserver' in window && bars.length) {
    const barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        const target = fill.getAttribute('data-fill') || '0';
        requestAnimationFrame(function () { fill.style.width = target + '%'; });
        const card = fill.closest('.bar');
        if (card) {
          const pct = card.querySelector('.bar-pct');
          const t = parseInt(pct.getAttribute('data-target') || '0', 10);
          animateNumber(pct, t, 1200);
        }
        barIO.unobserve(fill);
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { barIO.observe(b); });
  }

  function animateNumber(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + '%';
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + '%';
    }
    requestAnimationFrame(tick);
  }

  // ===== Project filter =====
  const filterBtns = document.querySelectorAll('[data-filter-btn][data-target]');
  const projectItems = document.querySelectorAll('[data-filter-item]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-target');
      filterBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      projectItems.forEach(function (item) {
        const cat = item.getAttribute('data-category');
        const show = target === 'all' || cat === target;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // ===== Contact form validation =====
  const form = document.querySelector('[data-form]');
  const formBtn = document.querySelector('[data-form-btn]');
  const formInputs = document.querySelectorAll('[data-form-input]');
  if (form && formBtn) {
    formInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        formBtn.disabled = !form.checkValidity();
      });
    });
  }

})();
