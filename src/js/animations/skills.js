import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSkills() {
  const tiers = gsap.utils.toArray('.skills__tier');
  if (!tiers.length) return;

  gsap.from(tiers, {
    y: 48,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '[data-skills-tiers]',
      start: 'top 85%',
      once: true,
    },
  });

  // The whole marquee band drifts as you scroll through the section
  // (the wrapper, not the track — the track runs the CSS keyframe loop)
  const band = document.querySelector('.skills__marquee');
  if (band) {
    gsap.to(band, {
      xPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.skills',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}
