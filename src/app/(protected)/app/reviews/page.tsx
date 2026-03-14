import { reviews } from "@/lib/mock-data";

export default function ReviewsPage() {
  return (
    <div className="panel p-6">
      <p className="section-kicker">Review workflow</p>
      <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">Reviews</h1>
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
            <h2 className="text-lg text-white">{review.title}</h2>
            <p className="mt-3 text-sm text-slate-400">
              {review.owner} moved this item from {review.from} to {review.to}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{review.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
