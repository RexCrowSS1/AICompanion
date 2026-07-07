import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const scanRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return undefined;

    const root = document.documentElement;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    function setActive(target) {
      const active =
        target instanceof Element &&
        Boolean(target.closest("a, button, input, textarea, [data-cursor='focus']"));
      root.classList.toggle("cursor-active", active);
    }

    function onMove(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      [cursorRef.current, scanRef.current].forEach((element) => {
        element?.style.setProperty("--x", `${mouseX}px`);
        element?.style.setProperty("--y", `${mouseY}px`);
      });
      root.classList.remove("cursor-hidden");
      setActive(event.target);
    }

    function onLeave() {
      root.classList.add("cursor-hidden");
      root.classList.remove("cursor-active");
    }

    function onEnter(event) {
      root.classList.remove("cursor-hidden");
      setActive(event.target);
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ringRef.current?.style.setProperty("--x", `${ringX}px`);
      ringRef.current?.style.setProperty("--y", `${ringY}px`);
      frame = window.requestAnimationFrame(animate);
    }

    root.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    animate();

    return () => {
      root.classList.remove("has-custom-cursor", "cursor-active", "cursor-hidden");
      window.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-scan" ref={scanRef} aria-hidden="true" />
    </>
  );
}
