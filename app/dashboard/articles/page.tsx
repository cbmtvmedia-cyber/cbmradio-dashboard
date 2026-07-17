"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../../components/toast";

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  status: "Draft" | "Published";
}

export default function ArticlesPage() {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        localStorage.setItem("radio_articles", JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingArticle) {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingArticle.id, title, summary, content, coverImage, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        const updatedList = list.map((a) => (a.id === updated.id ? updated : a));
        setList(updatedList);
        localStorage.setItem("radio_articles", JSON.stringify(updatedList));
        setToast("📰 Article contents successfully updated!");
      }
    } else {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary: summary || "CBM broadcast bulletin.", content, coverImage: coverImage || "https://unsplash.com", status }),
      });
      if (res.ok) {
        const newArticle = await res.json();
        const updatedList = [newArticle, ...list];
        setList(updatedList);
        localStorage.setItem("radio_articles", JSON.stringify(updatedList));
        setToast("📰 New news article published to directory live!");
      }
    }
    clearForm();
  };

  const startEdit = (a: Article) => {
    setEditingArticle(a);
    setTitle(a.title);
    setSummary(a.summary);
    setContent(a.content);
    setCoverImage(a.coverImage);
    setStatus(a.status);
    setShowForm(true);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    localStorage.setItem("radio_articles", JSON.stringify(updatedList));
    setToast(`🗑️ News article "${itemTitle.toUpperCase()}" deleted successfully.`);
    setTimeout(() => setToast(null), 2500);
  };

  const clearForm = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setCoverImage("");
    setStatus("Draft");
    setEditingArticle(null);
    setShowForm(false);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="p-4 text-xs text-slate-500 animate-pulse">📡 Fetching Station Press Board...</div>;

  const filteredList = list.filter((a) => a.title.toLowerCase().includes(search));

  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">News Articles</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage all active broadcasting bulletins.</p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="text" placeholder="🔍 Search articles..." value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" />
          <button onClick={() => { if (showForm) clearForm(); else setShowForm(true); }} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer">{showForm ? "✕ Dismiss" : "＋ Add Article"}</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide">
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Article Headline Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline brief summary..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Brief Summary Track *</label>
              <input type="text" required value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short introductory teaser snippet..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Cover Thumbnail Image URL</label>
              <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://unsplash.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <label className="block text-slate-400 mb-1">Core Narrative Article Body Content</label>
              <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Full article writeup markdown..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Publishing Stream Deployment Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "Draft" | "Published" )} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none">
                <option value="Draft">⚠️ Draft Node</option>
                <option value="Published">🚀 Published Live</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={clearForm} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded uppercase tracking-wider">{editingArticle ? "Update Story" : "Publish Story"}</button>
            </div>
          </div>
        </form>
      )}

      {filteredList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono tracking-wide animate-pulse">📡 No bulletin articles match your query parameters.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((art) => (
            <div key={art.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row group hover:border-slate-700 transition">
              <div className="relative w-full md:w-44 h-32 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
                <Image src={art.coverImage || "https://unsplash.com"} alt={art.title} fill className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate">{art.title}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${art.status === "Published" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"}`}>{art.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{art.summary}</p>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800/60 font-bold text-xs">
                  <button onClick={() => startEdit(art)} className="text-slate-400 hover:text-emerald-400 transition">Edit</button>
                  <span className="text-slate-800">|</span>
                  <button onClick={() => handleDelete(art.id, art.title)} className="text-rose-500 hover:text-rose-400 transition">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
