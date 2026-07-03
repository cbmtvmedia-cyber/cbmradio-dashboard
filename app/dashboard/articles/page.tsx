"use client";
import React, { useEffect, useState } from "react";
import Toast from "../../components/toast";

interface Article {
  id: string;
  title: string;
  featuredImage: string;
  content: string;
  youtubeLink: string;
  author: string;
  publishDate: string;
  status: "Draft" | "Published";
}

export default function ArticlesPage() {
  const [list, setList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // 📝 DOCUMENT DATA STATES
  const [title, setTitle] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [content, setContent] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, featuredImage: featuredImage || "https://unsplash.com", content, youtubeLink, author, publishDate: publishDate || "2026-07-03", status }),
    });

    if (res.ok) {
      const newArticle = await res.json();
      setList([newArticle, ...list]);
      setTitle(""); setFeaturedImage(""); setContent(""); setYoutubeLink(""); setAuthor(""); setPublishDate(""); setStatus("Draft");
      setShowForm(false);
      setToast("📰 Article saved and logged into local network pipeline!");
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDelete = (id: string, itemTitle: string) => {
    setList(list.filter(item => item.id !== id));
    setToast(`🗑️ Article "${itemTitle}" removed from local storage.`);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="p-4 text-xs text-slate-500 animate-pulse">📡 Fetching News Articles...</div>;

  const filteredList = list.filter(a => a.title.toLowerCase().includes(search) || a.author.toLowerCase().includes(search));

  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">News Articles Manager</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage news articles and blog content.</p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="text" placeholder="🔍 Search articles..." value={search} onChange={e => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" />
          <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer">{showForm ? "✕ Dismiss" : "＋ Write Article"}</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide">
          <div className="space-y-3">
            <div><label className="block text-slate-400 mb-1">Article Title *</label><input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter headline" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
            <div><label className="block text-slate-400 mb-1">Author Name *</label><input type="text" required value={author} onChange={e => setAuthor(e.target.value)} placeholder="Writer's name" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /></div>
            <div><label className="block text-slate-400 mb-1">Featured Image URL</label><input type="text" value={featuredImage} onChange={e => setFeaturedImage(e.target.value)} placeholder="https://unsplash.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
            <div><label className="block text-slate-400 mb-1">Embedded YouTube Video Link (Optional)</label><input type="url" value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)} placeholder="https://youtube.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div><label className="block text-slate-400 mb-1">Publish Date</label><input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /></div>
            <div><label className="block text-slate-400 mb-1">Workflow Status</label><select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none"><option value="Draft">Save as Draft</option><option value="Published">Publish Article</option></select></div>
            <div><label className="block text-slate-400 mb-1">Rich Text Content *</label><textarea rows={3} required value={content} onChange={e => setContent(e.target.value)} placeholder="Write the main story body content here..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" /></div>
            <button type="submit" className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-md cursor-pointer uppercase tracking-wider">Publish / Save Article</button>
          </div>
        </form>
      )}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-x-auto">
        {filteredList.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-mono tracking-wide animate-pulse">
            📡 No active news article logs match your query criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2 pl-1">Story Overview</th>
                <th className="pb-2">Writer / Author</th>
                <th className="pb-2">Date / Info</th>
                <th className="pb-2 text-right pr-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredList.map(art => (
                <tr key={art.id} className="hover:bg-slate-800/10 transition">
                  <td className="py-3 pl-1 font-bold text-white max-w-xs sm:max-w-md">
                    <div className="flex items-center space-x-2">
                      <span className={`w-1.5 h-12 rounded shrink-0 ${art.status === "Published" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      <div className="truncate">
                        <div className="text-xs text-slate-100 truncate">{art.title}</div>
                        <div className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">{art.content}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-slate-300">✍️ {art.author}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-400">
                    <div>{art.publishDate || "2026-07-03"}</div>
                    <div className={`text-[9px] font-bold uppercase mt-0.5 ${art.status === "Published" ? "text-emerald-400" : "text-amber-400"}`}>{art.status}</div>
                  </td>
                  <td className="py-3 text-right pr-1 space-x-2 whitespace-nowrap">
                    {art.youtubeLink && <a href={art.youtubeLink} target="_blank" rel="noreferrer" className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 text-[10px]">YouTube</a>}
                    <button onClick={() => handleDelete(art.id, art.title)} className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-[10px] font-bold transition cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

