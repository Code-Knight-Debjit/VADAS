import clsx from "clsx";

const styles = {
  online: "bg-emerald-400",
  offline: "bg-amber-400",
  critical: "bg-rose-400"
};

export default function StatusBadge({ label, tone = "online" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
      <span className={clsx("status-dot", styles[tone])} />
      {label}
    </span>
  );
}
