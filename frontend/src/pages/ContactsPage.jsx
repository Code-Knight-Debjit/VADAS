import { useEffect, useState } from "react";
import api from "../api/client";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  async function loadContacts() {
    const response = await api.get("/contacts");
    setContacts(response.data);
  }

  useEffect(() => {
    loadContacts().catch(console.error);
  }, []);

  async function handleCreate(values) {
    await api.post("/contacts", values);
    await loadContacts();
  }

  async function handleUpdate(values) {
    await api.patch(`/contacts/${editingContact._id}`, values);
    setEditingContact(null);
    await loadContacts();
  }

  async function handleDelete(contactId) {
    await api.delete(`/contacts/${contactId}`);
    await loadContacts();
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Emergency contacts</p>
        <h1 className="mt-2 font-display text-4xl">Priority-based contact manager</h1>
      </header>
      <ContactForm initialValues={editingContact} onCancel={() => setEditingContact(null)} onSubmit={editingContact ? handleUpdate : handleCreate} />
      <ContactTable contacts={contacts} onDelete={handleDelete} onEdit={setEditingContact} />
    </div>
  );
}
