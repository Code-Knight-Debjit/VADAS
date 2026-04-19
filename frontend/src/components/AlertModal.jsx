import { useEffect, useState } from "react";

export default function AlertModal({ visible, onCancel, onConfirm, alertType }) {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(60);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          onConfirm();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [visible, onConfirm]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur">
      <div className="panel w-full max-w-xl p-7">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-300">Accident trigger detected</p>
        <h2 className="mt-3 font-display text-3xl">Emergency alert will be sent in {secondsLeft}s</h2>
        <p className="mt-4 text-slate-300">
          This {alertType} event will notify emergency contacts unless cancelled. Use this window to stop false positives.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
          >
            Cancel Alert
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
          >
            Send Immediately
          </button>
        </div>
      </div>
    </div>
  );
}
