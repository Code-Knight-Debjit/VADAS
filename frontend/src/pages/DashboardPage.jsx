import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/client";
import StatCard from "../components/StatCard";
import MapPanel from "../components/MapPanel";
import AlertModal from "../components/AlertModal";
import LogsPanel from "../components/LogsPanel";
import StatusBadge from "../components/StatusBadge";
import ChatbotWidget from "../components/ChatbotWidget";
import { useAuth } from "../context/AuthContext";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAlertQueue } from "../hooks/useAlertQueue";
import { enqueueAlert, readLastLocation, removeQueuedAlert } from "../lib/storage";

function buildPayload({ type, location, severity, threshold }) {
  return {
    type,
    source: "web-ui",
    severity,
    status: "countdown",
    location: location || readLastLocation(),
    sensorSnapshot: {
      threshold,
      shakeForce: severity,
      deviceMotionAvailable: true
    }
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const online = useNetworkStatus();
  const location = useGeolocation(user);
  const [summary, setSummary] = useState({ totalAlerts: 0, activeCountdowns: 0, failedAlerts: 0, lastAlertAt: null });
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [threshold, setThreshold] = useState(3.2);
  const [simulatedNetworkDown, setSimulatedNetworkDown] = useState(false);
  const [shakeValue, setShakeValue] = useState(0);
  useAlertQueue(online && !simulatedNetworkDown);

  const actuallyOnline = online && !simulatedNetworkDown;

  const appendLog = useCallback((message, detail) => {
    setLogs((current) => [
      { id: crypto.randomUUID(), message, detail, timestamp: new Date().toLocaleTimeString() },
      ...current
    ].slice(0, 12));
  }, []);

  async function loadDashboard() {
    const [summaryResponse, alertsResponse] = await Promise.all([
      api.get("/alerts/summary"),
      api.get("/alerts")
    ]);

    setSummary(summaryResponse.data);
    setAlerts(alertsResponse.data);
  }

  useEffect(() => {
    loadDashboard().catch(console.error);
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

    socket.on("system:hello", (payload) => {
      appendLog("Realtime channel connected", payload.message);
    });

    socket.on("alert:created", (payload) => {
      setAlerts((current) => [payload, ...current]);
      appendLog("Alert created", `${payload.type} alert entered ${payload.status} state`);
      loadDashboard().catch(console.error);
    });

    socket.on("alert:updated", (payload) => {
      setAlerts((current) => current.map((item) => (item._id === payload._id ? payload : item)));
      appendLog("Alert updated", `Alert ${payload._id} is now ${payload.status}`);
      loadDashboard().catch(console.error);
    });

    return () => socket.disconnect();
  }, [appendLog]);

  useEffect(() => {
    let timeoutId;

    function handleMotion(event) {
      const acceleration = event.accelerationIncludingGravity || {};
      const magnitude = Math.sqrt(
        (acceleration.x || 0) ** 2 +
        (acceleration.y || 0) ** 2 +
        (acceleration.z || 0) ** 2
      );

      setShakeValue(Number(magnitude.toFixed(2)));

      if (magnitude >= threshold && !timeoutId) {
        timeoutId = window.setTimeout(() => {
          triggerAlert("detected", magnitude).catch(console.error);
          timeoutId = null;
        }, 1200);
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [threshold, location, activeAlert]);

  const metrics = useMemo(() => [
    { label: "Total alerts", value: summary.totalAlerts, helper: "All processed incidents" },
    { label: "Active countdowns", value: summary.activeCountdowns, helper: "Pending operator confirmation" },
    { label: "Failed dispatches", value: summary.failedAlerts, helper: "Queued for retry/follow-up" },
    { label: "Current shake value", value: shakeValue, helper: `Trigger threshold ${threshold}` }
  ], [summary, shakeValue, threshold]);

  async function triggerAlert(type, severity = threshold + 0.6) {
    if (activeAlert) {
      return;
    }

    const payload = buildPayload({ type, location, severity, threshold });
    const created = actuallyOnline ? await api.post("/alerts", payload) : null;

    if (!actuallyOnline) {
      const queueId = enqueueAlert({ payload });
      appendLog("Stored offline alert", "Alert saved locally and will be retried when the network is restored");
      setActiveAlert({ localOnly: true, payload, type, queueId });
      return;
    }

    setActiveAlert({ id: created.data._id, type });
  }

  async function confirmAlert() {
    if (!activeAlert) {
      return;
    }

    if (activeAlert.localOnly) {
      setActiveAlert(null);
      return;
    }

    await api.post(`/alerts/${activeAlert.id}/send`);
    appendLog("Alert dispatched", "SMS, email, and dashboard failover workflow started");
    setActiveAlert(null);
    loadDashboard().catch(console.error);
  }

  async function cancelPendingAlert() {
    if (activeAlert?.localOnly && activeAlert.queueId) {
      removeQueuedAlert(activeAlert.queueId);
      appendLog("Offline alert cancelled", "Queued alert removed before retry dispatch");
    }

    if (activeAlert?.id) {
      await api.post(`/alerts/${activeAlert.id}/cancel`);
      appendLog("Alert cancelled", "Operator stopped dispatch within countdown window");
      loadDashboard().catch(console.error);
    }

    setActiveAlert(null);
  }

  async function triggerHardwareSimulation() {
    await api.post("/alerts/trigger-hardware-alert", {
      severity: 8.7,
      location: location || readLastLocation()
    });
    appendLog("Hardware simulation", "Remote IoT failover endpoint triggered");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Control center</p>
          <h1 className="mt-2 font-display text-4xl">Accident Monitoring Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={actuallyOnline ? "Realtime online" : "Offline / remote area mode"} tone={actuallyOnline ? "online" : "offline"} />
          <StatusBadge label={location ? "GPS lock active" : "Waiting for GPS"} tone={location ? "online" : "critical"} />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <StatCard key={metric.label} {...metric} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MapPanel location={location} />
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Detection controls</h2>
            <button
              className={`rounded-full px-4 py-2 text-xs font-semibold ${simulatedNetworkDown ? "bg-amber-500 text-slate-950" : "bg-white/10"}`}
              onClick={() => setSimulatedNetworkDown((current) => !current)}
              type="button"
            >
              {simulatedNetworkDown ? "Remote area mode on" : "Simulate low network"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Device motion above the threshold creates an alert. Manual and hardware triggers are also available for testing operations and demos.
          </p>
          <div className="mt-6">
            <label className="text-sm text-slate-400">Detection threshold: {threshold.toFixed(1)} g</label>
            <input className="mt-2 w-full" max="8" min="1.5" onChange={(event) => setThreshold(Number(event.target.value))} step="0.1" type="range" value={threshold} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <button className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold" onClick={() => triggerAlert("manual", threshold + 1)} type="button">
              Manual Trigger
            </button>
            <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm" onClick={triggerHardwareSimulation} type="button">
              Trigger Hardware Alert
            </button>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
            <p>Last GPS: {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "Unavailable"}</p>
            <p>Store-and-forward: {actuallyOnline ? "Ready to send" : "Local queue active"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <LogsPanel logs={logs} />
        <ChatbotWidget />
      </section>

      <section className="panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Latest Alerts</h2>
          <p className="text-sm text-slate-400">Newest 100 records</p>
        </div>
        <div className="mt-4 space-y-3">
          {alerts.slice(0, 6).map((alert) => (
            <div key={alert._id} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-100">{alert.type} alert from {alert.source}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(alert.createdAt).toLocaleString()} | {alert.location?.lat?.toFixed?.(4)}, {alert.location?.lng?.toFixed?.(4)}
                  </p>
                </div>
                <StatusBadge label={alert.status} tone={alert.status === "sent" ? "online" : alert.status === "failed" ? "critical" : "offline"} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <AlertModal
        alertType={activeAlert?.type || "detected"}
        onCancel={cancelPendingAlert}
        onConfirm={confirmAlert}
        visible={Boolean(activeAlert)}
      />
    </div>
  );
}
