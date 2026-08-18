/* Mou67 — interaction layer. No dependencies, no build step.
   Everything here is progressive enhancement: without JS the page is
   still complete and readable (see .no-js in base.css). */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var motion = !reduced && finePointer;

  /* ── Scroll reveal ──────────────────────────────────────────── */

  var revealItems = document.querySelectorAll('[data-reveal]');

  function show(el) {
    var delay = parseInt(el.getAttribute('data-reveal') || '0', 10);
    setTimeout(function () {
      el.classList.add('is-visible');
    }, delay);
  }

  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    );

    // Observe after layout settles, and reveal whatever is already on
    // screen immediately so a no-scroll load is never blank.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        revealItems.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            show(el);
          } else {
            observer.observe(el);
          }
        });
      });
    });

    // Safety net: reveal anything at or above the fold that the observer
    // missed — an anchor jump can skip an element straight past the
    // viewport, and it must not be stuck invisible when scrolled back to.
    // Content still below stays hidden, so its reveal survives.
    var sweep = function () {
      revealItems.forEach(function (el) {
        if (el.classList.contains('is-visible')) return;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    };

    var queued = false;
    window.addEventListener(
      'scroll',
      function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
          queued = false;
          sweep();
        });
      },
      { passive: true }
    );

    setTimeout(sweep, 2500);
  }

  /* ── Cursor glow ────────────────────────────────────────────── */

  var glow = document.querySelector('[data-glow]');

  if (motion) {
    if (glow) glow.classList.add('is-active');

    window.addEventListener(
      'pointermove',
      function (event) {
        if (glow) {
          glow.style.transform =
            'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0)';
        }
      },
      { passive: true }
    );

    /* ── Tilt cards ───────────────────────────────────────────── */

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 5;
      var baseShadow = getComputedStyle(el).boxShadow;

      el.addEventListener('pointermove', function (event) {
        var rect = el.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width;
        var py = (event.clientY - rect.top) / rect.height;

        el.style.transform =
          'perspective(1000px) rotateY(' +
          ((px - 0.5) * 2 * max).toFixed(2) +
          'deg) rotateX(' +
          ((0.5 - py) * 2 * max).toFixed(2) +
          'deg) translateZ(0)';
        el.style.boxShadow =
          'inset ' +
          ((0.5 - px) * 30).toFixed(0) +
          'px ' +
          ((0.5 - py) * 30).toFixed(0) +
          'px 60px color-mix(in srgb, var(--color-neutral-100) 10%, transparent), ' +
          baseShadow;
      });

      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
        el.style.boxShadow = baseShadow;
      });
    });
  }

  /* ── Mobile navigation ──────────────────────────────────────── */

  var toggle = document.querySelector('[data-nav-toggle]');
  var links = document.querySelector('[data-nav-links]');

  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.nav__inner')) setOpen(false);
    });
  }

  /* ── Active section in the nav ──────────────────────────────── */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.setAttribute(
              'aria-current',
              link.getAttribute('href') === '#' + entry.target.id ? 'true' : 'false'
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }
})();
