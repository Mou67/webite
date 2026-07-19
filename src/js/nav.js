import { getLenis } from './scroll.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!nav || !toggle || !menu) return;

  // Hide on scroll down, reveal on scroll up
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (menu.classList.contains('is-open')) {
          nav.classList.remove('is-hidden');
        } else if (y > 120 && y > lastY + 4) {
          nav.classList.add('is-hidden');
        } else if (y < lastY - 4 || y <= 120) {
          nav.classList.remove('is-hidden');
        }
        lastY = y;
        ticking = false;
      });
    },
    { passive: true }
  );

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  };

  toggle.addEventListener('click', () =>
    setOpen(!menu.classList.contains('is-open'))
  );
  menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => setOpen(false))
  );
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}
