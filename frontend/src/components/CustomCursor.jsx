import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    const onOver = (e) => {
      const t = e.target;
      const isInteractive = t?.closest?.("a, button, [role='button'], input, textarea, select, [data-cursor='hover']");
      setHover(!!isInteractive);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className={`cs-cursor ${hover ? "is-hover" : ""}`} data-testid="custom-cursor" />;
}
