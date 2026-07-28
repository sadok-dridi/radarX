"use client";

import { useLayoutEffect, useEffect, useRef, useState, ReactNode } from "react";
import { gsap } from "gsap";

export function PageEntrance({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setKey((k) => k + 1);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>("[data-animate]");
    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    elements.forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.6 }, i * 0.15);
    });
  }, [key]);

  return <div ref={containerRef}>{children}</div>;
}
