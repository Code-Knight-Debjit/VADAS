import { useEffect, useState } from "react";

const defaultState = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
  priority: 1,
  status: "active"
};

export default function ContactForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues || defaultState);

  useEffect(() => {
    setForm(initialValues || defaultState);
  }, [initialValues]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form
      className="panel space-y-4 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...form, priority: Number(form.priority) });
        setForm(defaultState);
      }}
    >
      <h3 className="font-display text-xl">{initialValues ? "Edit Contact" : "Add Contact"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl bg-slate-950/60 px-4 py-3" name="name" placeholder="Name" value={form.name} onChange={updateField} required />
        <input className="rounded-2xl bg-slate-950/60 px-4 py-3" name="relationship" placeholder="Relationship" value={form.relationship} onChange={updateField} />
        <input className="rounded-2xl bg-slate-950/60 px-4 py-3" name="phone" placeholder="Phone number" value={form.phone} onChange={updateField} required />
        <input className="rounded-2xl bg-slate-950/60 px-4 py-3" name="email" placeholder="Email" value={form.email} onChange={updateField} />
        <input className="rounded-2xl bg-slate-950/60 px-4 py-3" min="1" max="10" name="priority" type="number" placeholder="Priority" value={form.priority} onChange={updateField} />
        <select className="rounded-2xl bg-slate-950/60 px-4 py-3" name="status" value={form.status} onChange={updateField}>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="unreachable">Unreachable</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold" type="submit">
          Save Contact
        </button>
        {onCancel ? (
          <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
