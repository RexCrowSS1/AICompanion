import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const scanRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    function setActive(target) {
      const active = Boolean(target.closest("a, button, input, textarea, [data-cursor='focus']"));
      document.documentElement.classList.toggle("cursor-active", active);
    }

    function onMove(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      [cursorRef.current, scanRef.current].forEach((element) => {
        element?.style.setProperty("--x", `${mouseX}px`);
        element?.style.setProperty("--y", `${mouseY}px`);
      });
      setActive(event.target);
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ringRef.current?.style.setProperty("--x", `${ringX}px`);
      ringRef.current?.style.setProperty("--y", `${ringY}px`);
      frame = window.requestAnimationFrame(animate);
    }

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", onMove, { passive: true });
    animate();

    return () => {
      document.documentElement.classList.remove("has-custom-cursor", "cursor-active");
      window.removeEventListener("mousemove", onMove);
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
