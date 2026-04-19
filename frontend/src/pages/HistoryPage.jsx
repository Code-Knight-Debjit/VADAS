import { useEffect, useState } from "react";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";

export default function HistoryPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/alerts").then((response) => setAlerts(response.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Alert history</p>
        <h1 className="mt-2 font-display text-4xl">Incident timeline and delivery audit</h1>
      </header>
      <section className="space-y-4">
        {alerts.map((alert) => (
          <article key={alert._id} className="panel p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-display text-2xl capitalize">{alert.type} alert</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {new Date(alert.createdAt).toLocaleString()} | source: {alert.source}
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  Coordinates: {alert.location?.lat ?? "--"}, {alert.location?.lng ?? "--"}
                </p>
              </div>
              <StatusBadge label={alert.status} tone={alert.status === "sent" ? "online" : alert.status === "failed" ? "critical" : "offline"} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">SMS: {alert.notificationResults?.sms}</div>
              <div className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">Email: {alert.notificationResults?.email}</div>
              <div className="rounded-2xl bg-slate-950/60 p-3 text-sm text-slate-300">Dashboard: {alert.notificationResults?.dashboard}</div>
            </div>
            {!!alert.logs?.length && (
              <div className="mt-4 space-y-2">
                {alert.logs.map((log, index) => (
                  <div key={`${alert._id}-${index}`} className="rounded-2xl border border-white/10 p-3 text-sm text-slate-300">
                    <span className="font-medium text-white">{log.status}</span> - {log.message}
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
