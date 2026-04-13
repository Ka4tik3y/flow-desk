export function Select({ label, children, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-xs uppercase tracking-[0.32em] text-black/60">{label}</span> : null}
      <select
        className={`rounded-3xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
