import { useEffect, useState } from "react";
import api from "../api/client";

export default function SettingsPage() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function loadDocuments() {
    const response = await api.get("/rag/documents");
    setDocuments(response.data);
  }

  useEffect(() => {
    loadDocuments().catch(console.error);
  }, []);

  async function uploadDocument(event) {
    event.preventDefault();
    if (!file) {
      return;
    }

    const payload = new FormData();
    payload.append("title", title || file.name);
    payload.append("document", file);

    await api.post("/rag/upload", payload, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    setStatus("Document indexed successfully.");
    setTitle("");
    setFile(null);
    event.target.reset();
    await loadDocuments();
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Settings and AI knowledge</p>
        <h1 className="mt-2 font-display text-4xl">System configuration and RAG management</h1>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="panel space-y-4 p-5" onSubmit={uploadDocument}>
          <h2 className="font-display text-2xl">Upload knowledge document</h2>
          <p className="text-sm leading-7 text-slate-400">
            Add PDFs or plain-text files containing accident safety steps, operating procedures, escalation playbooks, or insurance guidance.
          </p>
          <input className="w-full rounded-2xl bg-slate-950/60 px-4 py-3" placeholder="Document title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input className="w-full rounded-2xl bg-slate-950/60 px-4 py-3" onChange={(event) => setFile(event.target.files?.[0] || null)} type="file" accept=".pdf,.txt,.md" />
          <button className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold" type="submit">
            Upload and index
          </button>
          {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
        </form>

        <section className="panel p-5">
          <h2 className="font-display text-2xl">Indexed documents</h2>
          <div className="mt-4 space-y-3">
            {documents.map((document) => (
              <div key={document._id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="font-medium">{document.title}</p>
                <p className="mt-1 text-sm text-slate-400">{document.mimeType} | {document.chunks} chunks</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-2xl">Environment checklist</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/50 p-4 text-sm text-slate-300">Set `JWT_SECRET`, `MONGODB_URI`, and `CLIENT_URL` before production deployment.</div>
          <div className="rounded-2xl bg-slate-950/50 p-4 text-sm text-slate-300">Configure Twilio and SMTP credentials for live outbound alerts. The app automatically falls back to mocked channels when they are not set.</div>
          <div className="rounded-2xl bg-slate-950/50 p-4 text-sm text-slate-300">Use `RAG_PROVIDER=openai` or `RAG_PROVIDER=ollama` for real embeddings, or keep `local` for offline development.</div>
          <div className="rounded-2xl bg-slate-950/50 p-4 text-sm text-slate-300">Mapbox is optional. If missing, the dashboard still shows live coordinates and last-known-location data.</div>
        </div>
      </section>
    </div>
  );
}
