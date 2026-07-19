import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProjects() {
  gsap.utils.toArray('[data-project]').forEach((project) => {
    const media = project.querySelector('[data-project-media]');
    const image = media?.querySelector('img');
    const body = project.querySelector('.project__body');

    if (media) {
      gsap.from(media, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.1,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: project,
          start: 'top 78%',
          once: true,
        },
      });
    }

    // Scroll-linked parallax inside the masked frame (img is 115% tall)
    if (image) {
      gsap.fromTo(
        image,
        { yPercent: -11 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: project,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    if (body) {
      gsap.from(body.children, {
        y: 32,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: project,
          start: 'top 72%',
          once: true,
        },
      });
    }
  });
}
