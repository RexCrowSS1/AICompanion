import { useEffect } from "react";

export default function useScrollMotion() {
  useEffect(() => {
    const elements = [...document.querySelectorAll("[data-scroll-motion]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function update() {
      const viewportHeight = window.innerHeight || 1;
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const progress = 1 - rect.top / viewportHeight;
        const clamped = Math.min(1, Math.max(0, progress));
        element.style.setProperty("--scroll-progress", clamped.toFixed(3));
        if (rect.top < viewportHeight * 0.88 && rect.bottom > viewportHeight * 0.04) {
          element.classList.add("is-visible");
        }
      }
    }

    if (reducedMotion.matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    let frame = 0;
    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}
