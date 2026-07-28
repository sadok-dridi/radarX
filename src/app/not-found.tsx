import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="panel max-w-xl p-8 text-center">
        <p className="section-kicker">Not found</p>
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white">This route does not exist.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
           The page you asked for is not part of the current Paragon foundation.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/" className="rounded-full bg-white px-5 py-3 font-medium text-slate-950">
            Back home
          </Link>
          <Link href="/app" className="rounded-full border border-white/10 px-5 py-3 font-medium text-white">
            Open app
          </Link>
        </div>
      </div>
    </div>
  );
}
