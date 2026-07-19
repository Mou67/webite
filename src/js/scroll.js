import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

let lenis = null;

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target) {
  if (lenis) {
    lenis.start();
    lenis.scrollTo(target);
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }
}

export function initScroll() {
  if (!prefersReducedMotion) {
    lenis = new Lenis({ autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('[data-scroll-to]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    link.addEventListener('click', (event) => {
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
    });
  });
}
