import gsap from 'gsap';
import { prefersReducedMotion } from './scroll.js';

export function initCursor() {
  const root = document.querySelector('[data-cursor]');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!root || !fine || prefersReducedMotion) return;

  document.documentElement.classList.add('has-cursor');

  const dot = root.querySelector('[data-cursor-dot]');
  const ring = root.querySelector('[data-cursor-ring]');

  gsap.set([dot, ring], { x: -100, y: -100 });

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

  window.addEventListener(
    'pointermove',
    (event) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    },
    { passive: true }
  );

  // Hover states via delegation
  document.addEventListener('pointerover', (event) => {
    root.classList.remove('is-link', 'is-view');
    if (event.target.closest('[data-project-media]')) {
      root.classList.add('is-view');
    } else if (event.target.closest('a, button')) {
      root.classList.add('is-link');
    }
  });
  document.addEventListener('pointerout', () => {
    root.classList.remove('is-link', 'is-view');
  });

  // Fade out when the pointer leaves the window
  document.documentElement.addEventListener('pointerleave', () =>
    gsap.to(root, { autoAlpha: 0, duration: 0.2 })
  );
  document.documentElement.addEventListener('pointerenter', () =>
    gsap.to(root, { autoAlpha: 1, duration: 0.2 })
  );
}
