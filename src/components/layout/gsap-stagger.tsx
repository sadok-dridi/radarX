"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

export function GsapStaggerContainer({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
  }, [pathname]);

  useEffect(() => {
    if (hasAnimated.current) return;

    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".gsap-stagger-item");
    if (items.length === 0) return;

    hasAnimated.current = true;

    gsap.set(items, { opacity: 0, y: 20 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.1,
    });
  }, [pathname]);

  return (
    <div ref={containerRef} className="contents">
      {children}
    </div>
  );
}
