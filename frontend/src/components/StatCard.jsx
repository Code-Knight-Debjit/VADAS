export default function StatCard({ label, value, helper }) {
  return (
    <article className="panel p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-3 font-display text-3xl">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </article>
  );
}
