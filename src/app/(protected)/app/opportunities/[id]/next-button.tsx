"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function NextSignalButton({ href }: { href: string | null }) {
  const [cachedHref, setCachedHref] = useState(href);

  useEffect(() => {
    if (href) {
      setCachedHref(href);
    }
  }, [href]);

  if (!cachedHref) return null;

  return (
    <div className="mt-6 flex justify-end">
      <Link 
        href={cachedHref} 
        className="inline-flex items-center gap-2 rounded-[16px] bg-white/[0.03] border border-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white/[0.05] hover:border-accent-cyan/40 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(56,189,248,0.1)]"
      >
        <span>Continue to Next Signal</span>
        <svg className="h-4 w-4 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}
