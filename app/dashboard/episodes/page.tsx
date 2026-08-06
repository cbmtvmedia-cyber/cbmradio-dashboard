// 📁 FILE PATH: app/dashboard/episodes/page.tsx - BLOCK 1 OF 2
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../../components/toast";
import { extractApiError, SiteImageFields } from "../../components/site-image-fields";

interface Episode {
  id: string;
  programId: number;
  programTitle: string;
  title: string;
  description: string;
  thumbnailImage: string;
  externalThumbnailImage?: string;
  youtubeLink: string;
  downloadLink: string;
  publishDate: string;
}

interface ProgramOption {
  id: string;
  title: string;
}

export default function EpisodesPage() {
  const [list, setList] = useState<Episode[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // 📝 EXTRACTED FORM STATE FIELD HOOKS
  const [programId, setProgramId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => res.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : data.results || []);
        
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.results || [];
        setPrograms(items);
        if (items[0]) setProgramId(String(items[0].id));
      })
      .catch(() => setPrograms([]));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeLink) return;
    setFormError("");
    const form = new FormData();
    if (editingEpisode) form.set("id", editingEpisode.id);
    form.set("program_id", programId);
    form.set("title", title);
    form.set("description", description);
    form.set("youtube_link", youtubeLink);
    if (publishDate) form.set("publish_date", publishDate);
    if (thumbnailImage) form.set("cover_image", thumbnailImage);
    if (selectedFile) form.set("uploaded_cover_image", selectedFile);
    const res = await fetch("/api/episodes", {
      method: editingEpisode ? "PUT" : "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setFormError(extractApiError(data));
      return;
    }
    setList(editingEpisode
      ? list.map((episode) => episode.id === data.id ? data : episode)
      : [data, ...list]);
    setToast(editingEpisode ? "Episode updated." : "Episode created.");
    clearForm();
  };

  const startEdit = (ep: Episode) => {
    setEditingEpisode(ep);
    setProgramId(String(ep.programId));
    setTitle(ep.title);
    setDescription(ep.description);
    setThumbnailImage(ep.externalThumbnailImage || "");
    setSelectedFile(null);
    setYoutubeLink(ep.youtubeLink);
    
    // ⚡ FIXED CONDITIONAL ASSIGNMENT SCRIPT TO COMPLY WITH ESLINT RUN RULES
    if (downloadLink !== ep.downloadLink) {
      setDownloadLink(ep.downloadLink);
    }
    
    setPublishDate(ep.publishDate);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const res = await fetch(`/api/episodes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      setToast("Unable to delete the episode.");
      return;
    }
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    
    setToast(`🗑️ Episode "${name}" dropped from platform logs.`);
    setTimeout(() => setToast(null), 2500);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setThumbnailImage("");
    setYoutubeLink("");
    setDownloadLink("");
    setPublishDate("");
    setSelectedFile(null);
    setFormError("");
    setProgramId(programs[0] ? String(programs[0].id) : "");
    setEditingEpisode(null);
    setShowForm(false);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return (
    <div className="p-4 text-xs text-slate-500 animate-pulse">📡 Fetching Broadcast Catalog...</div>
  );

  const filteredList = list.filter(
    (e) => e.title.toLowerCase().includes(search) || e.programTitle.toLowerCase().includes(search),
  );
// 📁 FILE PATH: app/dashboard/episodes/page.tsx - BLOCK 2 OF 2
  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider"> Episode Archives </h1>
          <p className="text-xs text-slate-400 mt-0.5"> Manage all episodes published under the various CBM Radio programs. </p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="text" placeholder="🔍 Search episodes..." value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" />
          <button onClick={() => { if (showForm) clearForm(); else setShowForm(true); }} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer" > {showForm ? "✕ Dismiss" : "＋ Add Episode"} </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide" >
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1"> Parent Program Link * </label>
              <select required value={programId} onChange={(e) => setProgramId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Episode Title * </label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter episode name" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <SiteImageFields
              currentUrl={editingEpisode?.thumbnailImage}
              externalUrl={thumbnailImage}
              file={selectedFile}
              onExternalUrlChange={setThumbnailImage}
              onFileChange={setSelectedFile}
            />
            <div>
              <label className="block text-slate-400 mb-1"> Publish Date Calendar </label>
              <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <label className="block text-slate-400 mb-1"> YouTube Video URL Link * </label>
              <input type="url" required value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Audio Audio Download Link (MP3/WAV) </label>
              <input type="url" value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} placeholder="https://example.com" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Episode Overview Description </label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary story details..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={clearForm} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold" > Cancel </button>
              <button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded uppercase tracking-wider" > {editingEpisode ? "Update Log" : "Save Episode"} </button>
            </div>
            {formError && <p className="text-rose-400">{formError}</p>}
          </div>
        </form>
      )}

      <div className="space-y-4">
        {filteredList.map((ep) => (
          <div key={ep.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-5 shadow-sm group hover:border-slate-700 transition" >
            <div className="w-full md:w-40 h-24 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shrink-0 self-center md:self-start relative">
              {ep.thumbnailImage.trim() ? (
                <Image src={ep.thumbnailImage} alt={ep.title} fill unoptimized className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  No thumbnail
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3 w-full">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate"> {ep.title} </h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"> 📻 {ep.programTitle} </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-1"> {ep.description || "No description provided for this episode."} </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
                <div className="flex items-center space-x-4 font-mono text-[10px] text-slate-500">
                  <div> 📅 Aired: <span className="text-slate-400">{ep.publishDate}</span> </div>
                  {ep.downloadLink && (
                    <div> 💾 <a href={ep.downloadLink} target="_blank" rel="noreferrer" className="text-emerald-500/80 hover:underline" > Download MP3 File </a> </div>
                  )}
                  <div> 📺 <a href={ep.youtubeLink} target="_blank" rel="noreferrer" className="text-rose-400/80 hover:underline" > YouTube Source </a> </div>
                </div>
                <div className="flex space-x-3 font-bold ml-auto">
                  <button onClick={() => startEdit(ep)} className="text-slate-400 hover:text-emerald-400 transition" > Edit </button>
                  <span className="text-slate-800">|</span>
                  <button onClick={() => handleDelete(ep.id, ep.title)} className="text-rose-500 hover:text-rose-400 transition" > Delete </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
