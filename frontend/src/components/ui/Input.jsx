export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-xs uppercase tracking-[0.32em] text-black/60">{label}</span> : null}
      <input
        className={`rounded-3xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
