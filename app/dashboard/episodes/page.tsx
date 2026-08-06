// 📁 FILE PATH: app/dashboard/episodes/page.tsx - BLOCK 1 OF 2
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../../components/toast";
import { extractApiError, SiteImageFields } from "../../components/site-image-fields";
import { normalizeYouTubeEmbedUrl, YOUTUBE_EMBED_ERROR, YOUTUBE_EMBED_HELP } from "../../lib/youtube-embed";
import { StatusBadge } from "../../components/ui/surfaces";

interface Episode {
  id: string;
  programId: number;
  programTitle: string;
  title: string;
  description: string;
  thumbnailImage: string;
  externalThumbnailImage?: string;
  youtubeLink: string;
  youtubeEmbedUrl: string;
  downloadLink: string;
  publishDate: string;
  is_active: boolean;
}

interface ProgramOption {
  id: string;
  title: string;
  is_active: boolean;
}

async function loadProgramOptions() {
  const items: ProgramOption[] = [];
  const ids = new Set<string>();
  const visited = new Set<string>();
  let next: string | null = "/api/programs?page=1&ordering=title";
  let partial = false;
  for (let page = 0; next && page < 25; page += 1) {
    if (visited.has(next)) { partial = true; break; }
    visited.add(next);
    try {
      const response: Response = await fetch(next);
      if (!response.ok) { partial = true; break; }
      const data: { results?: ProgramOption[]; next?: string | null } | ProgramOption[] = await response.json();
      const results: ProgramOption[] = Array.isArray(data) ? data : data.results || [];
      for (const program of results) if (!ids.has(String(program.id))) { ids.add(String(program.id)); items.push(program); }
      if (Array.isArray(data) || !data.next) next = null;
      else { const url: URL = new URL(data.next); next = `/api/programs${url.search}`; }
    } catch { partial = true; break; }
  }
  if (next) partial = true;
  return { items, partial };
}

function episodeVisibilityLabel(episode: Episode, programs: ProgramOption[]) {
  if (!episode.is_active) return "Inactive Episode";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  if (episode.publishDate && episode.publishDate > today) return "Scheduled Episode";
  const parent = programs.find((program) => String(program.id) === String(episode.programId));
  if (episode.publishDate && parent?.is_active) return "Public Episode";
  return "Active Episode";
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
  const [youtubeError, setYoutubeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [programsPartial, setProgramsPartial] = useState(false);

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => res.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : data.results || []);
        
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
    void loadProgramOptions().then(({ items, partial }) => {
      setPrograms(items);
      setProgramsPartial(partial);
      if (items[0]) setProgramId(String(items[0].id));
    });
  }, []);

  const selectedProgram = programs.find((program) => String(program.id) === programId);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeLink || submitting) return;
    const normalizedEmbed = normalizeYouTubeEmbedUrl(youtubeLink);
    if (!normalizedEmbed) {
      setYoutubeError(YOUTUBE_EMBED_ERROR);
      return;
    }
    if (isActive && selectedProgram && !selectedProgram.is_active) {
      setFormError("Activate the parent Program before activating this Episode.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    setYoutubeError("");
    const form = new FormData();
    if (editingEpisode) form.set("id", editingEpisode.id);
    form.set("program_id", programId);
    form.set("title", title);
    form.set("description", description);
    form.set("youtube_embed_url", normalizedEmbed);
    form.set("is_active", String(isActive));
    if (publishDate) form.set("publish_date", publishDate);
    if (thumbnailImage) form.set("cover_image", thumbnailImage);
    if (selectedFile) form.set("uploaded_cover_image", selectedFile);
    const res = await fetch("/api/episodes", {
      method: editingEpisode ? "PUT" : "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const fieldError = data && typeof data === "object" && Array.isArray(data.youtube_link) && typeof data.youtube_link[0] === "string" ? data.youtube_link[0] : "";
      if (fieldError) setYoutubeError(fieldError);
      setFormError(extractApiError(data));
      setSubmitting(false);
      return;
    }
    setList(editingEpisode
      ? list.map((episode) => episode.id === data.id ? data : episode)
      : [data, ...list]);
    setToast(editingEpisode ? "Episode updated." : "Episode created.");
    setSubmitting(false);
    clearForm();
  };

  const startEdit = (ep: Episode) => {
    setEditingEpisode(ep);
    setProgramId(String(ep.programId));
    setTitle(ep.title);
    setDescription(ep.description);
    setThumbnailImage(ep.externalThumbnailImage || "");
    setSelectedFile(null);
    setYoutubeLink(ep.youtubeEmbedUrl || ep.youtubeLink);
    setYoutubeError("");
    setIsActive(ep.is_active);
    
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
    setYoutubeError("");
    setIsActive(true);
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
                  <option key={program.id} value={program.id}>{program.title} — {program.is_active ? "Active" : "Inactive"}</option>
                ))}
              </select>
              {programsPartial && <p className="mt-1 text-amber-300" role="status">Some Programs could not be loaded. Available options are shown.</p>}
              {selectedProgram && !selectedProgram.is_active && <p className="mt-1 text-amber-300" role="alert">This Program is inactive. The Episode will not be available through the public Program experience until the Program is activated.</p>}
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
              <label htmlFor="episode-youtube-embed" className="block text-slate-400 mb-1"> YouTube Embed URL * </label>
              <input id="episode-youtube-embed" type="url" required value={youtubeLink} onChange={(e) => { setYoutubeLink(e.target.value); setYoutubeError(""); }} aria-invalid={Boolean(youtubeError) || undefined} aria-describedby="episode-youtube-help episode-youtube-error" placeholder="https://www.youtube.com/embed/VIDEO_ID" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
              <p id="episode-youtube-help" className="mt-1 text-[10px] text-slate-500">{YOUTUBE_EMBED_HELP}</p>
              {youtubeError && <p id="episode-youtube-error" className="mt-1 text-rose-400" role="alert">{youtubeError}</p>}
            </div>
            {normalizeYouTubeEmbedUrl(youtubeLink) && <div className="video-embed-preview"><iframe src={normalizeYouTubeEmbedUrl(youtubeLink) || undefined} title={`${title || "Episode"} video preview`} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}
            <div>
              <label className="block text-slate-400 mb-1"> Audio Audio Download Link (MP3/WAV) </label>
              <input type="url" value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} placeholder="https://example.com" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Episode Overview Description </label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary story details..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={clearForm} disabled={submitting} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold disabled:opacity-50" > Cancel </button>
              <button type="submit" disabled={submitting} className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded uppercase tracking-wider disabled:opacity-50" > {submitting ? "Saving…" : editingEpisode ? "Update Log" : "Save Episode"} </button>
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
            <div>
              <label htmlFor="episode-visibility" className="block text-slate-400 mb-1">Public visibility</label>
              <select id="episode-visibility" value={isActive ? "active" : "inactive"} onChange={(e) => setIsActive(e.target.value === "active")} disabled={submitting} aria-describedby="episode-visibility-help" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white">
                <option value="active">Active — eligible for public publication</option>
                <option value="inactive">Inactive — hidden from the public website</option>
              </select>
              <p id="episode-visibility-help" className="mt-1 text-[10px] text-slate-500">Active Episodes publish only when their date is today or earlier and their Program is active.</p>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3 w-full">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate"> {ep.title} </h3>
                  <StatusBadge status={ep.is_active ? "active" : "inactive"} label={episodeVisibilityLabel(ep, programs)} />
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
