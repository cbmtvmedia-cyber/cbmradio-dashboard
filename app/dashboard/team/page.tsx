// 📁 FILE PATH: app/dashboard/team/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Toast from "../../components/toast";

interface Member {
  id: string;
  name: string;
  category: string;
  position: string;
  photo: string;
  tagline: string;
  biography: string;
  socialLinks: string;
}

export default function TeamPage() {
  const [list, setList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // 📝 DOC COMPLIANT FIELD STATES
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Presenters");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState("");
  const [tagline, setTagline] = useState("");
  const [biography, setBiography] = useState("");
  const [socialLinks, setSocialLinks] = useState("");

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    if (editingMember) {
      // Handle Edit Mode (PUT)
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingMember.id, name, category, position, photo, tagline, biography, socialLinks }),
      });
      if (res.ok) {
        const updated = await res.json();
        setList(list.map(m => m.id === updated.id ? updated : m));
        setToast("👥 Team profile edited and updated successfully!");
      }
    } else {
      // Handle Add Mode (POST)
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, position, photo: photo || "https://unsplash.com", tagline, biography, socialLinks }),
      });
      if (res.ok) {
        const newMember = await res.json();
        setList([newMember, ...list]);
        setToast("👥 New Team member profile added live!");
      }
    }

    clearForm();
  };

  const startEdit = (m: Member) => {
    setEditingMember(m);
    setName(m.name);
    setCategory(m.category);
    setPosition(m.position);
    setPhoto(m.photo);
    setTagline(m.tagline);
    setBiography(m.biography);
    setSocialLinks(m.socialLinks);
    setShowForm(true);
  };

  const handleDelete = (id: string, memberName: string) => {
    setList(list.filter(item => item.id !== id));
    setToast(`🗑️ Profile for "${memberName}" deleted successfully.`);
    setTimeout(() => setToast(null), 2500);
  };

  const clearForm = () => {
    setName(""); setPosition(""); setPhoto(""); setTagline(""); setBiography(""); setSocialLinks("");
    setCategory("Presenters"); setEditingMember(null); setShowForm(false);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="p-4 text-xs text-slate-500 animate-pulse">📡 Fetching Team Directory...</div>;

  const filteredList = list.filter(m => m.name.toLowerCase().includes(search) || m.position.toLowerCase().includes(search));

  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Team Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage everyone displayed on the Team page.</p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="text" placeholder="🔍 Search profiles..." value={search} onChange={e => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" />
          <button onClick={() => { if (showForm) clearForm(); else setShowForm(true); }} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer">{showForm ? "✕ Dismiss" : "＋ Add Member"}</button>
        </div>
      </div>

      {/* 🛠️ DYNAMIC INPUT FORM HANDLING BOTH ADD & EDIT COMPLIANCE */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide">
          <div className="space-y-3">
            <div><label className="block text-slate-400 mb-1">Full Name *</label><input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Jenkins" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
            <div><label className="block text-slate-400 mb-1">Position / Title *</label><input type="text" required value={position} onChange={e => setPosition(e.target.value)} placeholder="Morning Show DJ" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
            <div><label className="block text-slate-400 mb-1">Category Roster Group *</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none"><option value="Leadership">Leadership</option><option value="Presenters">Presenters</option><option value="Producers">Producers</option><option value="Guest Contributors">Guest Contributors</option></select></div>
            <div><label className="block text-slate-400 mb-1">Profile Photo URL</label><input type="text" value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div><label className="block text-slate-400 mb-1">Short Tagline *</label><input type="text" required value={tagline} onChange={e => setTagline(e.target.value)} placeholder="A catchphrase summary" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
            <div><label className="block text-slate-400 mb-1">Social Media Links URL</label><input type="url" value={socialLinks} onChange={e => setSocialLinks(e.target.value)} placeholder="https://linkedin.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
            <div><label className="block text-slate-400 mb-1">Full Biography Paragraph</label><textarea rows={3} value={biography} onChange={e => setBiography(e.target.value)} placeholder="Write background overview..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" /></div>
            <div className="flex justify-end space-x-2"><button type="button" onClick={clearForm} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold">Cancel</button><button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded uppercase tracking-wider">{editingMember ? "Update Member" : "Commit Member"}</button></div>
          </div>
        </form>
      )}

      {/* RENDERED CARDS GRIID EXHIBITING REQUISITE PROPERTY DETAILS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredList.map(m => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start shadow-sm group hover:border-slate-700 transition">
            <img src={m.photo || "https://unsplash.com"} alt="" className="w-20 h-22 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0 self-center sm:self-start" />
            <div className="flex-1 min-w-0 space-y-2 w-full">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{m.name}</h3>
                  <div className="text-xs text-emerald-400 font-medium mt-0.5">{m.position}</div>
                </div>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">{m.category}</span>
              </div>
              <p className="text-xs text-slate-300 italic font-medium">"{m.tagline || "No tagline provided."}"</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{m.biography || "No biography filled out yet."}</p>
              {m.socialLinks && (<div className="text-[10px] font-mono text-slate-500 truncate">🔗 URL: <a href={m.socialLinks} target="_blank" rel="noreferrer" className="text-emerald-500/80 hover:underline">{m.socialLinks}</a></div>)}
              <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800/60 text-xs">
                <button onClick={() => startEdit(m)} className="text-slate-400 hover:text-emerald-400 font-bold transition">Edit</button>
                <span className="text-slate-800">|</span>
                <button onClick={() => handleDelete(m.id, m.name)} className="text-rose-500 hover:text-rose-400 font-bold transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
