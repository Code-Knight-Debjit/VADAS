export default function LogsPanel({ logs }) {
  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl">System Logs</h3>
        <span className="text-xs text-slate-400">{logs.length} events</span>
      </div>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-200">{log.message}</p>
              <span className="text-xs text-slate-500">{log.timestamp}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{log.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
