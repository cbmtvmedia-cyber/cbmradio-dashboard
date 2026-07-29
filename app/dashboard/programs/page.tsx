// 📁 FILE PATH: app/dashboard/programs/page.tsx 
"use client"; 
import React, { useEffect, useState } from "react"; 
import Image from "next/image"; 
import Toast from "../../components/toast"; 

interface Program { 
  id: string; 
  title: string; 
  description: string; 
  coverImage: string; 
  presenter: string; 
} 

export default function ProgramsPage() { 
  const [list, setList] = useState<Program[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [showForm, setShowForm] = useState(false); 
  const [editingProgram, setEditingProgram] = useState<Program | null>(null); 
  const [search, setSearch] = useState(""); 
  const [toast, setToast] = useState<string | null>(null); 
  
  // 📝 DOC COMPLIANT FIELD STATES 
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [coverImage, setCoverImage] = useState(""); 
  const [presenter, setPresenter] = useState(""); 

  useEffect(() => { 
    fetch("/api/programs") 
      .then((res) => res.json()) 
      .then((data) => { 
        setList(Array.isArray(data) ? data : data.results || []);
     
        setLoading(false); 
      }) 
      .catch(() => setLoading(false)); 
  }, []); 

  const handleSave = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!title || !presenter) return; 
    
    if (editingProgram) { 
      // Handle Edit Action Engine (PUT) 
      const res = await fetch("/api/programs", { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          id: editingProgram.id, 
          title, 
          description, 
          coverImage, 
          presenter, 
        }), 
      }); 
      if (res.ok) { 
        const updated = await res.json(); 
        const updatedList = list.map((p) => (p.id === updated.id ? updated : p));
        setList(updatedList);
       
        setToast("🎙️ Radio program data fields successfully edited!"); 
      } 
    } else { 
      // Handle Add Action Engine (POST) 
      const res = await fetch("/api/programs", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          title, 
          description: description || "Active CBM Radio channel.", 
          coverImage: coverImage || "https://unsplash.com", 
          presenter, 
        }), 
      }); 
      if (res.ok) { 
        const newProg = await res.json(); 
        const updatedList = [newProg, ...list];
        setList(updatedList);
        
        setToast("🎙️ New CBM Radio program brand channel added live!"); 
      } 
    } 
    clearForm(); 
  }; 

  const startEdit = (p: Program) => { 
    setEditingProgram(p); 
    setTitle(p.title); 
    setDescription(p.description); 
    setCoverImage(p.coverImage); 
    setPresenter(p.presenter); 
    setShowForm(true); 
  }; 

  const handleDelete = (id: string, itemTitle: string) => { 
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList); 
   
    setToast( `🗑️ Show channel "${itemTitle.toUpperCase()}" deleted successfully.`, ); 
    setTimeout(() => setToast(null), 2500); 
  }; 

  const clearForm = () => { 
    setTitle(""); 
    setDescription(""); 
    setCoverImage(""); 
    setPresenter(""); 
    setEditingProgram(null); 
    setShowForm(false); 
    setTimeout(() => setToast(null), 2500); 
  }; 

  if (loading) return ( 
    <div className="p-4 text-xs text-slate-500 animate-pulse"> 
      📡 Fetching Radio Programs... 
    </div> 
  ); 

  const filteredList = list.filter( 
    (p) => p.title.toLowerCase().includes(search) || p.presenter.toLowerCase().includes(search), 
  ); 

  return ( 
    <div className="space-y-6 view-fade"> 
      <Toast message={toast} /> 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4"> 
        <div> 
          <h1 className="text-xl font-bold text-white uppercase tracking-wider"> Radio Programs </h1> 
          <p className="text-xs text-slate-400 mt-0.5"> Manage all CBM Radio programs channels. </p> 
        </div> 
        <div className="flex items-center space-x-3"> 
          <input type="text" placeholder="🔍 Search programs..." value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" /> 
          <button onClick={() => { if (showForm) clearForm(); else setShowForm(true); }} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer" > {showForm ? "✕ Dismiss" : "＋ Add Program"} </button> 
        </div> 
      </div> 

      {showForm && ( 
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide" > 
          <div className="space-y-3"> 
            <div> 
              <label className="block text-slate-400 mb-1"> Program Title * </label> 
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. morning show, youth talk" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /> 
            </div> 
            <div> 
              <label className="block text-slate-400 mb-1"> Presenter Name * </label> 
              <input type="text" required value={presenter} onChange={(e) => setPresenter(e.target.value)} placeholder="Sarah Jenkins" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" /> </div> 
            <div> 
              <label className="block text-slate-400 mb-1"> Cover Image URL </label> 
              <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://unsplash.com..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none font-mono" /> 
            </div> 
          </div> 
          <div className="space-y-3 flex flex-col justify-between"> 
            <div> 
              <label className="block text-slate-400 mb-1"> Description Overview Slot Notes </label> 
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter track details, schedule slots summary..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" /> </div> 
            <div className="flex justify-end space-x-2"> 
              <button type="button" onClick={clearForm} className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold" > Cancel </button> 
              <button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded uppercase tracking-wider" > {editingProgram ? "Update Program" : "Commit Program"} </button> 
            </div> 
          </div> 
        </form> 
      )} 

      {filteredList.length === 0 ? ( 
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono tracking-wide animate-pulse"> 📡 No active show programs match your query criteria. </div> 
      ) : ( 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          {filteredList.map((prog) => ( 
            <div key={prog.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:border-slate-700 transition" > 
              <div className="relative w-full sm:w-36 h-40 bg-slate-950 border-b sm:border-b-0 sm:border-r border-slate-800 shrink-0"> 
                <Image src={ prog.coverImage || "https://unsplash.com" } alt={prog.title} fill className="w-full h-full object-cover transition duration-300 group-hover:scale-105" /> 
              </div> 
              <div className="p-4 flex-1 min-w-0 flex flex-col justify-between space-y-3"> 
                <div className="space-y-1"> 
                  <div className="flex items-start justify-between gap-2"> 
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate"> {prog.title} </h3> 
                    <span className="text-[10px] font-bold text-emerald-400 shrink-0 font-sans"> 🎙️ {prog.presenter} </span> 
                  </div> 
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed pt-1"> {prog.description} </p> 
                </div> 
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs"> 
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase font-mono tracking-widest"> Live Channel Track </span> 
                  <div className="flex space-x-3 font-bold"> 
                    <button onClick={() => startEdit(prog)} className="text-slate-400 hover:text-emerald-400 transition" > Edit </button> 
                    <span className="text-slate-800">|</span> 
                    <button onClick={() => handleDelete(prog.id, prog.title)} className="text-rose-500 hover:text-rose-400 transition" > Delete </button> 
                  </div> 
                </div> 
              </div> 
            </div> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
}
