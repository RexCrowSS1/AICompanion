import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function useCinematicScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.86,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.set(".hero-copy", { transformOrigin: "left center" });
      gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.95,
        },
      })
        .to(".hero-copy", { y: -46, scale: 0.96, opacity: 0.56, ease: "none" }, 0)
        .to(".hero-stage", { y: 54, rotateX: 4, scale: 0.985, ease: "none" }, 0)
        .to(".hero-visual", { x: -58, y: 24, rotate: -5, scale: 1.12, ease: "none" }, 0)
        .to(".interface-card", { x: 54, y: -18, rotate: 3, ease: "none" }, 0)
        .to(".signal-strip", { y: -22, ease: "none" }, 0);

      gsap.to(".ticker-band div", {
        xPercent: -24,
        ease: "none",
        scrollTrigger: {
          trigger: ".ticker-band",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: ".cinematic-strip",
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.9,
        },
      })
        .fromTo(".cinematic-word.left", { xPercent: -6 }, { xPercent: -46, ease: "none" }, 0)
        .fromTo(".cinematic-word.right", { xPercent: 6 }, { xPercent: 48, ease: "none" }, 0)
        .fromTo(".cinematic-orbit", { rotate: -34, scale: 0.72 }, { rotate: 144, scale: 0.96, ease: "none" }, 0)
        .fromTo(".cinematic-card", { y: 74, opacity: 0.32, rotate: -6 }, { y: -46, opacity: 0.96, rotate: 7, stagger: 0.08, ease: "none" }, 0)
        .to(".cinematic-core", { scale: 1.12, rotate: 16, ease: "none" }, 0)
        .fromTo(".cinematic-sheet", { yPercent: 96, opacity: 0.72 }, { yPercent: 0, opacity: 1, ease: "none" }, 0.24);

      gsap.utils.toArray(".sticky-chapter").forEach((chapter) => {
        const copy = chapter.querySelector(".chapter-copy");
        const visual = chapter.querySelector(".chapter-visual");
        const depth = chapter.querySelectorAll(".chapter-depth span");
        const slice = chapter.querySelector(".chapter-slice");
        const orbit = chapter.querySelector(".chapter-orbit");
        const cards = chapter.querySelectorAll(".chapter-detail-grid small");
        const media = chapter.querySelectorAll(".chapter-media-stack figure");
        const sheet = chapter.querySelector(".chapter-sheet");
        const navline = chapter.querySelector(".chapter-navline");
        const readout = chapter.querySelector(".chapter-readout");

        gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
          },
        })
          .fromTo(copy, { y: 64, opacity: 0.58 }, { y: -42, opacity: 1, ease: "none" }, 0)
          .fromTo(visual, { y: 58, rotateX: 6, scale: 0.96 }, { y: -34, rotateX: -1, scale: 1.005, ease: "none" }, 0)
          .fromTo(depth, { y: 42, opacity: 0.12 }, { y: -38, opacity: 0.5, stagger: 0.06, ease: "none" }, 0)
          .fromTo(media, { y: 64, x: 24, opacity: 0.25, rotate: -4 }, { y: -48, x: -10, opacity: 0.74, rotate: 3, stagger: 0.08, ease: "none" }, 0)
          .fromTo(sheet, { yPercent: 78, opacity: 0.66 }, { yPercent: 0, opacity: 1, ease: "none" }, 0.14)
          .fromTo(navline, { y: -24, opacity: 0.2 }, { y: 0, opacity: 1, ease: "none" }, 0)
          .to(readout, { y: -18, opacity: 0.84, ease: "none" }, 0)
          .to(slice, { rotate: 34, scale: 1.06, ease: "none" }, 0)
          .to(orbit, { rotate: 150, scale: 0.9, ease: "none" }, 0)
          .fromTo(cards, { y: 18, opacity: 0.38 }, { y: -10, opacity: 1, stagger: 0.05, ease: "none" }, 0);
      });

      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove(updateLenis);
    };
  }, []);
}
