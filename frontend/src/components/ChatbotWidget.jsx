import { useState } from "react";
import api from "../api/client";

export default function ChatbotWidget() {
  const [question, setQuestion] = useState("What should I do immediately after a vehicle accident?");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  async function submitQuestion(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/rag/query", { question });
      setAnswer(response.data.answer);
      setSources(response.data.citations);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel p-5">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">RAG assistant</p>
        <h3 className="mt-2 font-display text-2xl">Safety and system guide chatbot</h3>
      </div>
      <form className="space-y-4" onSubmit={submitQuestion}>
        <textarea
          className="min-h-32 w-full rounded-3xl bg-slate-950/60 px-4 py-4"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold" disabled={loading} type="submit">
          {loading ? "Searching knowledge base..." : "Ask assistant"}
        </button>
      </form>
      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
          {answer || "Upload emergency SOPs, insurer guidelines, or training PDFs in Settings to improve answers."}
        </p>
      </div>
      {!!sources.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map((source) => (
            <span key={source.id} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {source.title} ({source.score})
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
