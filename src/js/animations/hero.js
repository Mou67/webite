import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { experience } from '../../webgl/index.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const label = hero.querySelector('[data-hero-label]');
  const title = hero.querySelector('[data-hero-title]');
  const sub = hero.querySelector('[data-hero-sub]');
  const cta = hero.querySelector('[data-hero-cta]');
  const hint = hero.querySelector('[data-hero-hint]');
  const nav = document.querySelector('[data-nav]');

  // Hide before first paint; the intro reveals everything again
  gsap.set([label, sub, cta, hint, nav], { autoAlpha: 0 });
  gsap.set(title, { visibility: 'hidden' });

  document.fonts.ready.then(() => {
    const split = SplitText.create(title.querySelectorAll('.hero__line'), {
      type: 'chars',
    });
    gsap.set(title, { visibility: 'visible' });

    gsap
      .timeline({ defaults: { ease: 'power4.out' } })
      .from(split.chars, {
        yPercent: 115,
        duration: 1.2,
        stagger: 0.018,
      })
      .to(label, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
      .fromTo(
        sub,
        { y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
        0.55
      )
      .fromTo(
        cta,
        { y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
        0.7
      )
      .to([hint, nav], { autoAlpha: 1, duration: 0.8 }, 0.9);
  });

  // Pinned scrub: drives the particle morph/scatter and the headline exit
  const inner = hero.querySelector('.hero__inner');
  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: true,
        onUpdate: (self) => experience?.setProgress(self.progress),
      },
    })
    .to(inner, { yPercent: -20, autoAlpha: 0, duration: 0.55 }, 0)
    .to(hint, { autoAlpha: 0, duration: 0.15 }, 0)
    .to({}, { duration: 0.45 }, 0.55);
}
