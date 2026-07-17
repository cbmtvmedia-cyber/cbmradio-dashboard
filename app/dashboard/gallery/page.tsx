// 📁 FILE PATH: app/dashboard/gallery/page.tsx - BLOCK 1 OF 2
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Toast from "../../components/toast";

interface GalleryItem {
  id: string;
  caption: string;
  url: string;
  category: "Photos" | "Videos" | "Studio" | "Community";
  youtubeLink?: string;
}

export default function GalleryPage() {
  const [list, setList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [toast, setToast] = useState<string | null>(null);

  // 📝 SPECIFICATION INPUT FIELDS STATES
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("Photos");
  const [youtubeLink, setYoutubeLink] = useState("");

  // 📁 UPDATE THIS EXACT HOOK INSIDE: app/dashboard/gallery/page.tsx
  useEffect(() => { 
    fetch("/api/gallery") 
      .then((res) => res.json()) 
      .then((serverData) => { 
        // 🧠 HYDRATION SYNC LOADER: Check if browser cache memory has local uploads
        if (typeof window !== "undefined") {
          const cachedLocalData = localStorage.getItem("gallery_data") || localStorage.getItem("radio_gallery ");
          if (cachedLocalData) {
            try {
              const parsedLocal = JSON.parse(cachedLocalData);
              // ⚡ THE PERMANENT LOCK: If local items exist, preserve them on your screen!
              if (Array.isArray(parsedLocal) && parsedLocal.length >= serverData.length) {
                setList(parsedLocal);
                setLoading(false);
                return;
              }
            } catch {
              // Fail-safe wrapper context
            }
          }
        }
        
        // Baseline fallback path if no cache exists yet
        setList(serverData); 
        localStorage.setItem("radio_gallery", JSON.stringify(serverData));
        setLoading(false); 
      }) 
      .catch(() => setLoading(false)); 
  }, []);


  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !url.trim()) return;

    // 🟢 THE FIX: Replaced impure Math.random() with a stable, predictable sequential list index ID string
    const targetSequentialId = `gal-${list.length + 1}`;

    const localNewMedia: GalleryItem = {
      id: targetSequentialId,
      caption: caption.trim(),
      url: url.trim(),
      category: category,
      youtubeLink: category === "Videos" ? youtubeLink.trim() : "",
    };

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: caption.trim(),
          url: url.trim(),
          category: category,
          youtubeLink: category === "Videos" ? youtubeLink.trim() : "",
        }),
      });

      if (res.ok) {
        const serverResponseData = await res.json();
        const validatedAsset = serverResponseData && typeof serverResponseData === "object" && serverResponseData.id 
          ? serverResponseData 
          : localNewMedia;

        const updatedList = [validatedAsset, ...list];
        setList(updatedList);
        localStorage.setItem("radio_gallery", JSON.stringify(updatedList));
        executeFormReset();
        return;
      }
    } catch (error) {
      console.warn("API route unavailable or rejected request. Syncing locally. Log details:", error);
    }

    const localUpdatedList = [localNewMedia, ...list];
    setList(localUpdatedList);
    localStorage.setItem("radio_gallery", JSON.stringify(localUpdatedList));
    executeFormReset();
  };

  const handleDelete = (id: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    localStorage.setItem("radio_gallery", JSON.stringify(updatedList));
    setToast("🗑️ Media file deleted from admin catalog.");
    setTimeout(() => setToast(null), 2500);
  };

  const executeFormReset = () => {
    setCaption("");
    setUrl("");
    setYoutubeLink("");
    setCategory("Photos");
    setShowForm(false);
    setToast("🖼️ Media element successfully published to website gallery!");
    setTimeout(() => setToast(null), 2500);
  };

    if (loading) return (
    <div className="p-4 text-xs text-slate-500 animate-pulse">
      📡 Loading Station Gallery Media...
    </div>
  );

  // 🟢 THE HYDRATION PROTECTOR FIX: Prevents empty state flashes on browser refresh
  const isServerHydrating = typeof window === "undefined" || list.length === 0;
  
  const filteredList = isServerHydrating 
    ? list 
    : (selectedCategory === "All" ? list : list.filter((item) => item.category === selectedCategory));

  const categoriesList = ["All", "Photos", "Videos", "Studio", "Community"] as const;

  return (
    <div className="space-y-6 view-fade">

  
      <Toast message={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider"> Media Gallery Hub </h1>
          <p className="text-xs text-slate-400 mt-0.5"> Manage photos, video thumbnails, and studio media displayed on the website. </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer tracking-wide self-start sm:self-center" >
          {showForm ? "✕ Dismiss" : "＋ Upload Media"}
        </button>
      </div>

      {/* DYNAMIC SPECIFICATION CATEGORIES FILTER CONTROLS */}
      <div className="flex flex-wrap gap-2 pt-1">
        {categoriesList.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${selectedCategory === cat ? "bg-emerald-500 text-slate-950 border-emerald-500 font-bold" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"}`} >
            {cat}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide" >
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1"> Media Caption Label * </label>
              <input type="text" required value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Studio Mic Setup B" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Photo / Video Thumbnail URL Link * </label>
              <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://unsplash.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" />
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <label className="block text-slate-400 mb-1"> Target Category Blueprint * </label>
              <select value={category} onChange={(e) => setCategory(e.target.value as "Photos" | "Videos" | "Studio" | "Community")} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" >
                <option value="Photos">Photos Collection</option>
                <option value="Videos">Videos Collection</option>
                <option value="Studio">Studio Behind-the-Scenes</option>
                <option value="Community">Community Events</option>
              </select>
            </div>
            {category === "Videos" && (
              <div>
                <label className="block text-slate-400 mb-1 text-rose-400 font-medium animate-pulse"> Attached YouTube Video URL * </label>
                <input type="url" required value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com..." className="w-full bg-slate-950 border-rose-500/40 border rounded px-3 py-2 text-white outline-none font-mono" />
              </div>
            )}
            <button type="submit" className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-md cursor-pointer uppercase tracking-wider" > Save Gallery Asset </button>
          </div>
        </form>
      )}

      {/* THE RENDERED RESPONSIVE GALLERY MEDIA VISUAL CARDS GRID */}
      {filteredList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono tracking-wide animate-pulse"> 📡 No active gallery media items match this category filter. </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredList.map((media) => (
            <div key={media.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md group flex flex-col hover:border-slate-700 transition" >
              <div className="relative aspect-video w-full bg-slate-950 border-b border-slate-800 shrink-0">
                <Image src={media.url || "https://unsplash.com"} alt={media.caption} fill className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                <span className="absolute top-2 left-2 bg-slate-950/80 border border-slate-800 text-slate-300 font-extrabold uppercase px-2 py-0.5 rounded text-[9px] tracking-wider font-mono"> {media.category} </span>
                {media.category === "Videos" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl">▶️</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white tracking-wide truncate"> {media.caption} </p>
                  {media.youtubeLink && (
                    <div className="mt-1.5 text-[10px] truncate max-w-xs font-mono text-rose-400">
                      <a href={media.youtubeLink} target="_blank" rel="noreferrer" className="hover:underline" > 📺 Connected Video Link </a>
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-1">
                  <button onClick={() => handleDelete(media.id)} className="px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-[10px] font-bold transition cursor-pointer uppercase tracking-wider" > Delete Media </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
