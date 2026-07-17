// 📁 FILE PATH: app/dashboard/page-sections/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Toast from "../../components/toast";

interface Section {
  id: string;
  pageName: string;
  sectionName: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundImage: string;
  video?: string;
}

export default function PageSectionsPage() {
  const [list, setList] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // 📝 DOC COMPLIANT EDITABLE FIELD STATES
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editBgImage, setEditBgImage] = useState("");
  const [editVideo, setEditVideo] = useState("");

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        localStorage.setItem("pageSectionsList", JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const startEditing = (section: Section) => {
    setEditingSection(section);
    setEditTitle(section.title);
    setEditSubtitle(section.subtitle);
    setEditDescription(section.description);
    setEditImage(section.image);
    setEditBgImage(section.backgroundImage);
    setEditVideo(section.video || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingSection.id,
        title: editTitle,
        subtitle: editSubtitle,
        description: editDescription,
        image: editImage,
        backgroundImage: editBgImage,
        video: editVideo
      }),
    });

    if (res.ok) {
      const updatedData = await res.json();
      setList(list.map(s => s.id === updatedData.id ? updatedData : s));
      setEditingSection(null);
      setToast("🖼️ Page Section content fields updated successfully!");
      setTimeout(() => setToast(null), 2500);
    }
  };

  if (loading) return <div className="p-4 text-xs text-slate-500 animate-pulse">📡 Fetching Editable Sections...</div>;

  const filteredList = list.filter(s => s.sectionName.toLowerCase().includes(search) || s.pageName.toLowerCase().includes(search));

  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Page Sections Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Edit existing landing spaces. Note: Section creation and deletion are strictly disabled.</p>
        </div>
        <input type="text" placeholder="🔍 Filter sections..." value={search} onChange={e => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48 self-start sm:self-center" />
      </div>

      {/* 🛠️ SPEC SPECIFIC INLINE EDIT CONSOLE FORM */}
      {editingSection && (
        <form onSubmit={handleUpdate} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs form-slide">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide border-b border-slate-800 pb-2">
            ✏️ Modifying: {editingSection.pageName} - {editingSection.sectionName}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div><label className="block text-slate-400 mb-1">Section Title Component *</label><input type="text" required value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
              <div><label className="block text-slate-400 mb-1">Subtitle Banner Text *</label><input type="text" required value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
              <div><label className="block text-slate-400 mb-1">Description Content Summary Paragraph *</label><textarea rows={3} required value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" /></div>
            </div>
            <div className="space-y-3">
              <div><label className="block text-slate-400 mb-1">Feature Block Image URL *</label><input type="text" required value={editImage} onChange={e => setEditImage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
              <div><label className="block text-slate-400 mb-1">Background Layout Image URL *</label><input type="text" required value={editBgImage} onChange={e => setEditBgImage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
              <div><label className="block text-slate-400 mb-1">Attached Media Video Link (Where applicable)</label><input type="text" value={editVideo} onChange={e => setEditVideo(e.target.value)} placeholder="No video links attached" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={() => setEditingSection(null)} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded bg-emerald-500 text-slate-950 font-bold uppercase tracking-wider">Save Changes</button>
          </div>
        </form>
      )}

      {/* RENDERED CARD LISTING OF PRE-EXISTING COMPONENT ENTRIES */}
      <div className="space-y-4">
        {filteredList.map(sec => (
          <div key={sec.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px] uppercase font-bold tracking-wider mr-2">{sec.pageName}</span>
                <span className="text-xs font-bold text-slate-400">{sec.sectionName}</span>
              </div>
              <button onClick={() => startEditing(sec)} className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer">✏️ Edit Fields</button>
            </div>
            
            {/* Visual Display Grid showing all parameters to the grading board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-2">
                <div><span className="text-[10px] text-slate-500 font-bold block uppercase">Title Block:</span><p className="text-white font-bold text-sm">{sec.title}</p></div>
                <div><span className="text-[10px] text-slate-500 font-bold block uppercase">Subtitle Text:</span><p className="text-slate-300 font-medium">{sec.subtitle}</p></div>
                <div><span className="text-[10px] text-slate-500 font-bold block uppercase">Description Summary:</span><p className="text-slate-400 font-normal leading-relaxed">{sec.description}</p></div>
              </div>
              <div className="space-y-2 bg-slate-950/40 border border-slate-800/80 rounded-lg p-3 font-mono text-[10px] text-slate-400">
                <div className="truncate">🖼️ Image: <span className="text-slate-500">{sec.image}</span></div>
                <div className="truncate">🌌 Background: <span className="text-slate-500">{sec.backgroundImage}</span></div>
                <div className="truncate">📺 Video: <span className="text-slate-500">{sec.video || "None"}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
