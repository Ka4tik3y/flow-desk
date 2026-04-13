export function SectionHeading({ eyebrow, title, body, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.32em] text-black/50">{eyebrow}</p> : null}
        <h2 className="mt-2 font-display text-5xl uppercase leading-none tracking-[0.04em] text-black md:text-6xl">
          {title}
        </h2>
        {body ? <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">{body}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
