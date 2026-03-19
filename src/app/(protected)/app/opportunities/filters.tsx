"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function OpportunitiesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 when filters change
    if (key !== "page") {
      params.delete("page");
    }

    if (value && value !== "all" && value !== "newest") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center p-1">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400 group-focus-within:text-accent-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search intel stream..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams("q", e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]"
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-accent-cyan" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative group w-full sm:w-auto">
          <select
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="w-full sm:w-auto appearance-none rounded-2xl border border-white/10 bg-white/[0.03] pl-4 pr-10 py-3 text-sm text-white focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="smart">Smart Match (Recommended)</option>
            <option value="confidence">Highest Confidence</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 group-hover:text-accent-cyan transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative group w-full sm:w-auto">
          <select
            value={currentStatus}
            onChange={(e) => updateParams("status", e.target.value)}
            className="w-full sm:w-auto appearance-none rounded-2xl border border-white/10 bg-white/[0.03] pl-4 pr-10 py-3 text-sm text-white focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="interesting">Interesting</option>
            <option value="qualified">Qualified</option>
            <option value="watch">Watch</option>
            <option value="ignored">Ignored</option>
            <option value="duplicate">Duplicate</option>
            <option value="acted_on">Acted On</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 group-hover:text-accent-cyan transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
