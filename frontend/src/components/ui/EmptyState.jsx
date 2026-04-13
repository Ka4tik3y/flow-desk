export function EmptyState({ title, body }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/70 p-8 text-center">
      <p className="text-lg font-medium text-black">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/55">{body}</p>
    </div>
  );
}
