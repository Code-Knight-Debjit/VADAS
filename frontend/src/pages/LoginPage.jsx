import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: ""
};

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(form, isRegister ? "/auth/register" : "/auth/login");
      navigate("/dashboard");
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || "Unable to authenticate");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form className="panel w-full max-w-lg space-y-4 p-8" onSubmit={handleSubmit}>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Secure access</p>
          <h1 className="mt-2 font-display text-4xl">{isRegister ? "Create operator account" : "Sign in to CrashGuard"}</h1>
        </div>
        {isRegister && (
          <>
            <input className="w-full rounded-2xl bg-slate-950/60 px-4 py-3" placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            <input className="w-full rounded-2xl bg-slate-950/60 px-4 py-3" placeholder="Phone number" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </>
        )}
        <input className="w-full rounded-2xl bg-slate-950/60 px-4 py-3" placeholder="Email address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
        <input className="w-full rounded-2xl bg-slate-950/60 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white" type="submit">
          {isRegister ? "Create account" : "Sign in"}
        </button>
        <button className="w-full text-sm text-slate-400" type="button" onClick={() => setIsRegister((current) => !current)}>
          {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
        </button>
      </form>
    </div>
  );
}
