import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initContact() {
  const title = document.querySelector('[data-contact-title]');
  const kicker = document.querySelector('[data-contact-kicker]');
  const actions = document.querySelector('[data-contact-actions]');

  if (title) {
    document.fonts.ready.then(() => {
      const split = SplitText.create(title, { type: 'chars' });
      gsap.set(title, { overflow: 'hidden' });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: title,
            start: 'top 82%',
            once: true,
          },
          defaults: { ease: 'power4.out' },
        })
        .from(split.chars, { yPercent: 115, duration: 1, stagger: 0.03 })
        .from(kicker, { autoAlpha: 0, y: 16, duration: 0.7 }, 0.2)
        .from(actions, { autoAlpha: 0, y: 24, duration: 0.7 }, 0.4);
    });
  }

  initMagnetic();
}

function initMagnetic() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * 0.35);
      yTo((event.clientY - rect.top - rect.height / 2) * 0.45);
    });

    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
