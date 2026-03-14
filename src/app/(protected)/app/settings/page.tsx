export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="panel p-6">
        <p className="section-kicker">Owner settings</p>
        <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">Settings</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          This screen is reserved for future scoring controls, alert rules, source tuning, and profile settings.
        </p>
      </section>
      <section className="panel p-6">
        <p className="section-kicker">Foundation</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Route exists now so admin controls can be added without restructuring the app later.
        </p>
      </section>
    </div>
  );
}
