export function StatBlock({ label, value, detail }) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card">
      <p className="text-xs uppercase tracking-[0.28em] text-black/45">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-black">{value}</p>
      {detail ? <p className="mt-2 text-sm text-black/55">{detail}</p> : null}
    </div>
  );
}
