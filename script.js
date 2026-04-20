/* ============================================================
   Portafolio · Jose Luis Serna
   Interacciones: reveals, scroll progress, nav, menú móvil
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------------
     1. Año actual en el footer
     ------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------
     2. Split text para el h1 con data-reveal-split
     ------------------------------------------------------------ */
  function splitHeroTitle() {
    const target = document.querySelector('[data-reveal-split]');
    if (!target || prefersReducedMotion) return;

    // Preservamos <br> pero partimos el texto en spans por letra
    const nodes = Array.from(target.childNodes);
    target.innerHTML = '';

    let charIndex = 0;
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        for (const ch of text) {
          const span = document.createElement('span');
          span.className = 'split-char';
          span.style.setProperty('--i', String(charIndex));
          // El espacio necesita nbsp para no colapsar
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          target.appendChild(span);
          charIndex++;
        }
      } else if (node.nodeName === 'BR') {
        target.appendChild(document.createElement('br'));
      } else {
        target.appendChild(node.cloneNode(true));
      }
    });
  }
  splitHeroTitle();

  /* ------------------------------------------------------------
     3. Reveal animations con IntersectionObserver
     ------------------------------------------------------------ */
  function setupReveals() {
    const revealTargets = $$('[data-reveal]');
    const underlineTargets = $$('.section__underline');
    const allTargets = [...revealTargets, ...underlineTargets];

    if (prefersReducedMotion) {
      // Mostrar todo sin animación
      allTargets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      allTargets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealSplitChars = (el) => {
      const chars = el.querySelectorAll('.split-char');
      const STAGGER = 35; // ms entre letras
      chars.forEach((span, i) => {
        setTimeout(() => span.classList.add('is-visible'), i * STAGGER);
      });
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          const applyReveal = () => {
            el.classList.add('is-visible');
            if (el.hasAttribute('data-reveal-split')) {
              revealSplitChars(el);
            }
          };
          if (delay > 0) {
            setTimeout(applyReveal, delay);
          } else {
            applyReveal();
          }
          obs.unobserve(el);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      }
    );

    allTargets.forEach((el) => observer.observe(el));
  }
  setupReveals();

  /* ------------------------------------------------------------
     4. Barra de progreso de scroll
     ------------------------------------------------------------ */
  const progressBar = document.getElementById('scrollProgressBar');
  let progressTicking = false;

  function updateScrollProgress() {
    if (!progressBar) return;
    const docEl = document.documentElement;
    const scrollTop = docEl.scrollTop || document.body.scrollTop;
    const scrollHeight = docEl.scrollHeight - docEl.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress.toFixed(2) + '%';
  }

  /* ------------------------------------------------------------
     5. Nav sticky: .is-scrolled cuando scroll > 30px
     ------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const SCROLL_THRESHOLD = 30;

  function updateNavState() {
    if (!nav) return;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    nav.classList.toggle('is-scrolled', scrolled);
  }

  /* ------------------------------------------------------------
     6. Scroll listener unificado (rAF throttled)
     ------------------------------------------------------------ */
  function onScroll() {
    if (progressTicking) return;
    progressTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavState();
      progressTicking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Init
  updateScrollProgress();
  updateNavState();

  /* ------------------------------------------------------------
     7. Link activo en nav según sección visible
     ------------------------------------------------------------ */
  function setupActiveNav() {
    const sections = $$('main section[id]');
    const navLinks = $$('.nav__link');
    if (!sections.length || !navLinks.length) return;

    const linkMap = new Map();
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        linkMap.set(href.slice(1), link);
      }
    });

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = linkMap.get(id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
  setupActiveNav();

  /* ------------------------------------------------------------
     8. Menú móvil
     ------------------------------------------------------------ */
  function setupMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('navMobile');
    if (!toggle || !overlay) return;

    const closeMenu = () => {
      toggle.classList.remove('is-open');
      overlay.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      toggle.classList.add('is-open');
      overlay.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('is-open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    // Cerrar al hacer click en un link del overlay
    $$('.nav-mobile__link', overlay).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Cerrar si se redimensiona a desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }
  setupMobileMenu();

  /* ------------------------------------------------------------
     9. Smooth scroll extra para anchors internos
        (respaldo por si CSS scroll-behavior no aplica)
     ------------------------------------------------------------ */
  function setupSmoothScroll() {
    if (prefersReducedMotion) return;
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Actualizar hash sin saltar
        history.pushState(null, '', href);
      });
    });
  }
  setupSmoothScroll();
})();
