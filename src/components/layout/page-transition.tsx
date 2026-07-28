"use client";

import { useRef, useEffect, ReactNode, createContext, useContext, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: (href: string) => Promise<void>;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  startTransition: async () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      content,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
    );
  }, [pathname]);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const overlay = overlayRef.current;
        const content = contentRef.current;
        if (overlay) gsap.set(overlay, { yPercent: 100 });
        if (content) {
          gsap.set(content, { opacity: 1, y: 0 });
          content.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
            gsap.set(el, { opacity: 1, y: 0 });
          });
        }
        setIsTransitioning(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const startTransition = useCallback(async (href: string): Promise<void> => {
    const overlay = overlayRef.current;
    if (!overlay || isTransitioning) return;
    setIsTransitioning(true);

    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = href;
          resolve();
        },
      });

      tl.fromTo(
        overlay,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.6, ease: "power4.inOut" }
      );
      tl.to(
        contentRef.current,
        { opacity: 0, y: -20, duration: 0.3, ease: "power3.in" },
        0
      );
    });
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9997] bg-zinc-950 pointer-events-none"
        style={{ transform: "translateY(100%)" }}
      />
      <div ref={contentRef}>{children}</div>
    </TransitionContext.Provider>
  );
}

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const { startTransition, isTransitioning } = usePageTransition();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isTransitioning) return;
    onClick?.();
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      window.open(href, "_blank");
      return;
    }
    await startTransition(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
