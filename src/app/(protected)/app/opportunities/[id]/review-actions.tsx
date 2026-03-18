"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { updateOpportunityStatus, addReviewNote } from "./actions";

export function ReviewActions({ opportunityId, currentStatus }: { opportunityId: string; currentStatus: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const statuses = [
    "new",
    "interesting",
    "qualified",
    "watch",
    "ignored",
    "duplicate",
    "acted_on",
  ];

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    
    startTransition(async () => {
      await updateOpportunityStatus(opportunityId, newStatus);
      router.refresh();
    });
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    startTransition(async () => {
      await addReviewNote(opportunityId, currentStatus, note);
      setNote("");
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <div className="rounded-[32px] border border-accent-cyan/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(56,189,248,0.05)] mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-pulse" />
        <h2 className="text-xl font-display font-bold text-white">Review Workflow</h2>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-accent-cyan">
            Set Status
          </label>
          <div className="flex flex-wrap gap-2.5">
            {statuses.map((status) => {
              const isActive = currentStatus === status;
              return (
                <button
                  key={status}
                  disabled={isPending}
                  onClick={() => handleStatusChange(status)}
                  className={`
                    rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300
                    ${isActive 
                      ? "bg-accent-cyan text-ink shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105 border-transparent" 
                      : "bg-slate-950/80 text-slate-400 border border-white/5 hover:border-accent-cyan/40 hover:text-white"
                    }
                    ${isPending ? "opacity-50 cursor-not-allowed scale-100" : ""}
                  `}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-accent-cyan">
            Add a Note
          </label>
          <form ref={formRef} onSubmit={handleAddNote} className="flex flex-col gap-4 relative group">
            <textarea
              disabled={isPending}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Jot down a quick thought on this lead..."
              className="w-full resize-none rounded-2xl border border-accent-purple/30 bg-slate-950/80 p-4 text-sm text-white placeholder:text-slate-500 focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all min-h-[120px] shadow-inner"
            />
            <button
              type="submit"
              disabled={isPending || !note.trim()}
              className="self-end inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue px-6 py-2.5 text-sm font-bold text-ink transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
            >
              <span>Save Note</span>
              {isPending ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
