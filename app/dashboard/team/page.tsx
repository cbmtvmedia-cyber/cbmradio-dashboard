"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../../components/toast";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: string;
  bio: string;
  image: string;
}

export default function TeamPage() {
  const [list, setList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [category, setCategory] = useState("Leadership");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : data.results || []);
     
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    if (editingMember) {
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        id: editingMember.id, 
        name, 
        role: position,   // 🔄 Maps 'position' to 'role'
        category, 
        bio, 
        photo: image      // 🔄 Maps local 'image' state to 'photo'
      }),
      });
      if (res.ok) {
        const updated = await res.json();
        const updatedList = list.map((m) => (m.id === updated.id ? updated : m));
        setList(updatedList);
        if (typeof window !== "undefined")
        
        setToast("👥 Team member details successfully updated!");
      }
    } else {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
        name, 
        role: position,   // 🔄 Maps 'position' to 'role' for the backend
        category, 
        bio: bio || "Station Staff Member.", 
        photo: image || "https://unsplash.com" 
              }),// 🔄 Maps 'image' to 'photo' for the backend
      });

      if (res.ok) {
        const newMember = await res.json();
        const updatedList = [newMember, ...list];
        setList(updatedList);
       
        
        setToast("👥 New staff profile added to directory live!");
      }
    }
    clearForm();
  };

  const startEdit = (m: TeamMember) => {
    setEditingMember(m);
    setName(m.name);
    setPosition(m.position);
    setCategory(m.category);
    setBio(m.bio);
    setImage(m.image);
    setShowForm(true);
  };

  const handleDelete = (id: string, memberName: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    
    setToast(`🗑️ Profile for "${memberName.toUpperCase()}" removed successfully.`);
    setTimeout(() => setToast(null), 2500);
  };

  const clearForm = () => {
    setName("");
    setPosition("");
    setCategory("Leadership");
    setBio("");
    setImage("");
    setEditingMember(null);
    setShowForm(false);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="p-4 text-xs text-slate-500 animate-pulse">📡 Fetching Team Directory...</div>;

  const filteredList = list.filter((m) => m.name.toLowerCase().includes(search) || m.position.toLowerCase().includes(search));

  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Station Team</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage all active radio staff personnel.</p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="text" placeholder="🔍 Search team..." value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" />
          <button onClick={() => { if (showForm) clearForm(); else setShowForm(true); }} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer">{showForm ? "✕ Dismiss" : "＋ Add Member"}</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide">
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Position / Role *</label>
              <input type="text" required value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Head of Production" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Roster Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none">
                <option value="Leadership">Leadership</option>
                <option value="Presenters">Presenters</option>
                <option value="Producers">Producers</option>
                <option value="Guest Contributors">Guest Contributors</option>
              </select>
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <label className="block text-slate-400 mb-1">Profile Image URL</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://unsplash.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Biography</label>
              <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief introduction notes..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={clearForm} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded uppercase tracking-wider">{editingMember ? "Update Profile" : "Commit Profile"}</button>
            </div>
          </div>
        </form>
      )}

      {filteredList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono tracking-wide animate-pulse">📡 No staff profiles match your query criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:border-slate-700 transition">
              <div className="relative w-full sm:w-32 h-36 bg-slate-950 border-b sm:border-b-0 sm:border-r border-slate-800 shrink-0">
                <Image src={m.image || "https://unsplash.com"} alt={m.name} fill className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate">{m.name}</h3>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-sans shrink-0">{m.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{m.position}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-1">{m.bio}</p>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800/60 font-bold text-xs">
                  <button onClick={() => startEdit(m)} className="text-slate-400 hover:text-emerald-400 transition">Edit</button>
                  <span className="text-slate-800">|</span>
                  <button onClick={() => handleDelete(m.id, m.name)} className="text-rose-500 hover:text-rose-400 transition">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
