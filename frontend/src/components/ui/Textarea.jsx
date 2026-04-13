export function Textarea({ label, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-xs uppercase tracking-[0.32em] text-black/60">{label}</span> : null}
      <textarea
        className={`min-h-28 rounded-[1.75rem] border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black ${className}`}
        {...props}
      />
    </label>
  );
}
