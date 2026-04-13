import { formatEnum } from "../../utils/format";

export function Badge({ value, tone = "default" }) {
  const tones = {
    default: "bg-black/[0.04] text-black",
    muted: "bg-black text-white",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {formatEnum(value)}
    </span>
  );
}
