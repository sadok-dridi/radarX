import Link from "next/link";

import { opportunities } from "@/lib/mock-data";

export default function OpportunitiesPage() {
  return (
    <div className="panel overflow-hidden p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Opportunity intelligence</p>
          <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">Opportunities</h1>
          <p className="mt-3 text-sm text-slate-400">Foundation table for search, filtering, review, and detail inspection.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="pb-4 pr-6 font-medium">Title</th>
              <th className="pb-4 pr-6 font-medium">Source</th>
              <th className="pb-4 pr-6 font-medium">Score</th>
              <th className="pb-4 pr-6 font-medium">Confidence</th>
              <th className="pb-4 pr-6 font-medium">Status</th>
              <th className="pb-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((item) => (
              <tr key={item.id} className="border-b border-white/5 align-top">
                <td className="py-5 pr-6">
                  <Link href={`/app/opportunities/${item.id}`} className="font-medium text-white transition hover:text-accent-cyan">
                    {item.title}
                  </Link>
                  <p className="mt-2 max-w-xl text-slate-400">{item.summary}</p>
                </td>
                <td className="py-5 pr-6 text-slate-300">{item.source}</td>
                <td className="py-5 pr-6 text-slate-300">{item.score}</td>
                <td className="py-5 pr-6 text-slate-300">{item.confidence}%</td>
                <td className="py-5 pr-6 text-slate-300">{item.status}</td>
                <td className="py-5 text-slate-300">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
