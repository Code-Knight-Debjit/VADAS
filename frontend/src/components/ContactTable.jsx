export default function ContactTable({ contacts, onEdit, onDelete }) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <h3 className="font-display text-xl">Emergency Contacts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border-t border-white/5">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-200">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.relationship}</p>
                </td>
                <td className="px-5 py-4 text-slate-300">{contact.priority}</td>
                <td className="px-5 py-4 text-slate-300">{contact.phone}</td>
                <td className="px-5 py-4 text-slate-300">{contact.status}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-white/10 px-3 py-2 text-xs" onClick={() => onEdit(contact)} type="button">Edit</button>
                    <button className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs text-rose-300" onClick={() => onDelete(contact._id)} type="button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
