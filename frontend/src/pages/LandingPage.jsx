import { Link } from "react-router-dom";
import { Activity, BellRing, MapPinned, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Accident detection",
    copy: "Threshold-based incident logic with device-motion support, manual triggering, and backend hardware simulation."
  },
  {
    icon: BellRing,
    title: "60-second smart alert",
    copy: "False-positive protection gives users a full countdown window before emergency notifications are dispatched."
  },
  {
    icon: MapPinned,
    title: "Location intelligence",
    copy: "Live GPS capture, last-known-location failover, and coordinate-rich alerts keep responders oriented."
  },
  {
    icon: ShieldCheck,
    title: "RAG safety assistant",
    copy: "Upload PDFs and text knowledge packs so operators can ask emergency-response and system-usage questions."
  }
];

export default function LandingPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <section className="panel mx-auto max-w-6xl overflow-hidden">
        <div className="grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Production-ready monitoring</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
              Vehicle Accident Detection and Alert System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A modern response platform for accident detection, live GPS monitoring, emergency-contact dispatch, offline failover, and AI-assisted safety guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white" to="/login">
                Launch Dashboard
              </Link>
              <a className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200" href="#features">
                Explore Features
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-rose-500/20 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Realtime channels</p>
                <h3 className="mt-2 font-display text-3xl">WebSockets</h3>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Backend stack</p>
                <h3 className="mt-2 font-display text-3xl">Node + Mongo</h3>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Dispatch flow</p>
                <h3 className="mt-2 font-display text-3xl">SMS + Email</h3>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Offline support</p>
                <h3 className="mt-2 font-display text-3xl">Store & Forward</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-6xl" id="features">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="panel p-5">
                <div className="inline-flex rounded-2xl bg-sky-500/15 p-3 text-sky-300">
                  <Icon />
                </div>
                <h2 className="mt-4 font-display text-2xl">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
