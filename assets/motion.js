/* ===================================================================
   Her Estrogen — motion layer (vanilla, self-hosted, ~3KB)
   Scroll reveals (IntersectionObserver) + subtle 3D tilt + hero parallax.
   - GPU-composited only (transform / opacity).
   - Waits for the Babel/React tree to mount before wiring up.
   - Honors prefers-reduced-motion. Tilt + parallax: desktop/non-touch only.
   - Pure progressive enhancement: if anything fails, a failsafe reveals
     all content, and the CSS hidden-state is gated to motion-OK + js-on.
   No external dependencies. CSP: served same-origin ('self').
   =================================================================== */
(function () {
  'use strict';

  var docEl  = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktop = window.matchMedia('(min-width: 901px)').matches;

  // Block-level fade-up targets
  var REVEAL = [
    '.lifestyle-strip', '.edu-head', '.edu-education', '.edu-table-wrap',
    '.treatments-two-col', '.products-scroll-wrapper', '.quiz-head',
    '.quiz-action', '.how-head', '.compare-head', '.compare-table',
    '.cta-final .narrow', 'footer .foot-simple', 'footer .foot-bottom'
  ];
  // Groups whose children stagger in
  var STAGGER = ['.edu-why-grid', '.symptom-grid', '.faq-list'];

  function tagAndObserve() {
    var targets = [];
    REVEAL.forEach(function (sel) {
      document.querySelectorAll('#root ' + sel).forEach(function (el) {
        if (!el.classList.contains('fx')) { el.classList.add('fx'); targets.push(el); }
      });
    });
    STAGGER.forEach(function (sel) {
      document.querySelectorAll('#root ' + sel).forEach(function (el) {
        if (!el.classList.contains('fx-stagger')) { el.classList.add('fx-stagger'); targets.push(el); }
      });
    });

    // Reduced motion or no IO support → just show everything, no animation.
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('fx-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('fx-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });

    // Failsafe: guarantee visibility even if an observer entry is missed.
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('fx-in'); });
    }, 3500);
  }

  function initTilt() {
    if (reduce || !fine || !desktop) return;
    docEl.classList.add('tilt-on');
    var MAX = 6; // degrees
    document.querySelectorAll('#root .product-card-new').forEach(function (card) {
      var raf = null;
      card.addEventListener('mousemove', function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = card.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width  - 0.5;
          var py = (ev.clientY - r.top)  / r.height - 0.5;
          card.style.transform =
            'perspective(900px) rotateY(' + (px * MAX).toFixed(2) + 'deg) rotateX(' +
            (-py * MAX).toFixed(2) + 'deg) scale(1.02)';
        });
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  function initParallax() {
    if (reduce || !desktop) return;
    var hero = document.querySelector('#root .hero-bg-img');
    if (!hero) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.scrollY;
        if (y <= window.innerHeight) {
          // Image moves at ~0.92x scroll speed; scale guard prevents edge gaps.
          hero.style.transform = 'scale(1.08) translate3d(0,' + (y * 0.06).toFixed(1) + 'px,0)';
        }
      });
    }
    hero.style.willChange = 'transform';
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // React mounts asynchronously via Babel; poll a few frames until ready.
  var tries = 0;
  function start() {
    var sections = document.querySelectorAll('#root section');
    if (sections.length < 3 && tries < 240) { tries++; return requestAnimationFrame(start); }
    tagAndObserve();
    initTilt();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
