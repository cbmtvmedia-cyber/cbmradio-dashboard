"use client";
import React, { useEffect, useState } from "react";
import Toast from "../../components/toast";

interface Comment {
  id: string;
  sender: string;
  text: string;
  targetType: "Article" | "Episode";
  targetTitle: string;
  replyText?: string;
  timestamp: string;
}

export default function CommentsPage() {
  const [list, setList] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSimForm, setShowSimForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 📝 STATES FOR VISITOR SIMULATION FIELDS
  const [sender, setSender] = useState("");
  const [text, setText] = useState("");
  const [targetType, setTargetType] = useState<"Article" | "Episode">("Episode");
  const [targetTitle, setTargetTitle] = useState("Live Studio Session Mix");

  // ADMIN OPERATIONS STATES
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [typedReply, setTypedReply] = useState("");

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => {
        const commentsData = data || [];
        setList(commentsData);
        // ⚡ THE SYNC: Seed initial fetch array so the home metrics counter updates on first load
        localStorage.setItem("radio_comments", JSON.stringify(commentsData));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 📡 CRITICAL SPEC RULE: Comments are displayed immediately after submission
  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !text.trim()) return;

    // Simulate immediate submission data payload package
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      sender,
      text,
      targetType,
      targetTitle,
      timestamp: "Just Now",
    };

    // Array unshift forces the new comment to render at the top instantly
    const updatedList = [newComment, ...list];
    setList(updatedList);
    // ⚡ THE SYNC: Push new list into localStorage so home counters increment instantly
    localStorage.setItem("radio_comments", JSON.stringify(updatedList));

    // Clear inputs and hide the testing box
    setSender("");
    setText("");
    setShowSimForm(false);

    // Fire up the verification notification toast
    setToast("✨ Success! Comment submitted and displayed immediately.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmitReply = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!typedReply.trim()) return;

    const updatedList = list.map((com) =>
      com.id === id ? { ...com, replyText: typedReply } : com
    );
    setList(updatedList);
    // ⚡ THE SYNC: Save updated array with the admin reply attached
    localStorage.setItem("radio_comments", JSON.stringify(updatedList));

    setActiveReplyId(null);
    setTypedReply("");
    setToast("💬 Administrator response successfully attached to comment thread!");
    setTimeout(() => setToast(null), 2500);
  };

  const handleDeleteComment = (id: string) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
    // ⚡ THE SYNC: Lower lengths inside cache so home screen tile drops instantly
    localStorage.setItem("radio_comments", JSON.stringify(updatedList));

    setToast("🗑️ Comment permanently removed from view layout.");
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return (
    <div className="p-4 text-xs text-slate-500 animate-pulse">
      📡 Fetching Comments Deck...
    </div>
  );

  const filteredList = list.filter((c) => {
    const senderMatch = c?.sender?.toLowerCase()?.includes(search) || false;
    const textMatch = c?.text?.toLowerCase()?.includes(search) || false;
    const titleMatch = c?.targetTitle?.toLowerCase()?.includes(search) || false;
    return senderMatch || textMatch || titleMatch;
  });
  return (
    <div className="space-y-6 view-fade">
      <Toast message={toast} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider"> Visitor Comments Deck </h1>
          <p className="text-xs text-slate-400 mt-0.5"> Manage visitor engagement and moderate listener interaction channels. </p>
        </div>
        <div className="flex items-center space-x-3">
          <input type="text" placeholder="🔍 Search comments..." value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} className="bg-slate-900 border border-slate-800 text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-emerald-500 w-48" />
          <button onClick={() => setShowSimForm(!showSimForm)} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-md cursor-pointer" > {showSimForm ? "✕ Dismiss Panel" : "＋ Simulate Visitor Submission"} </button>
        </div>
      </div>

      {/* 🛠️ SPEC VISITOR SUBMISSION SIMULATOR FORM CHANNELS */}
      {showSimForm && (
        <form onSubmit={handleVisitorSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs form-slide border-l-4 border-l-emerald-500" >
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400"> 🌐 Public Visitor Action Simulator </div>
            <div>
              <label className="block text-slate-400 mb-1"> Visitor Display Name * </label>
              <input type="text" required value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g., Listener John" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Target Module Type (System Relationships Rule) * </label>
              <select value={targetType} onChange={(e) => {
                const type = e.target.value as "Article" | "Episode";
                setTargetType(type);
                setTargetTitle(type === "Episode" ? "Live Studio Session Mix" : "Station Launches New Morning Grid Slot");
              }} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" >
                <option value="Episode">Comment on Episodes</option>
                <option value="Article">Comment on Articles</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1"> Select Active Show/Story Target * </label>
              <select value={targetTitle} onChange={(e) => setTargetTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none" >
                {targetType === "Episode" ? (
                  <>
                    <option value="Live Studio Session Mix"> Live Studio Session Mix (Radio Episode) </option>
                    <option value="Freelancing Without Burnout"> Freelancing Without Burnout (Radio Episode) </option>
                  </>
                ) : (
                  <>
                    <option value="Station Launches New Morning Grid Slot"> Station Launches New Morning Grid Slot (News Article) </option>
                    <option value="Top 10 Indie Audio Tracks This Summer"> Top 10 Indie Audio Tracks This Summer (News Article) </option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-end">
            <div>
              <label className="block text-slate-400 mb-1"> Comment Body Text * </label>
              <textarea rows={3} required value={text} onChange={(e) => setText(e.target.value)} placeholder="Type what the visitor writes under the thread..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none resize-none" />
            </div>
            <button type="submit" className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-md cursor-pointer uppercase tracking-wider" > Submit & Display Immediately </button>
          </div>
        </form>
      )}

      {/* 📊 ADMINISTRATOR WORKFLOW ZONE (VIEW, REPLY, DELETE) */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-mono tracking-wide animate-pulse"> 📡 No active visitor comments found. Click the simulation button above to submit an entry! </div>
        ) : (
          filteredList.map((com) => (
            <div key={com.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-800/80 transition" >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 font-mono"> 👤 {com.sender} </span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 tracking-wider"> Linked to {com.targetType} </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium font-sans mt-1"> 🎯 Resource Destination: <span className="italic text-white"> &quot;{com.targetTitle}&quot; </span> </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0"> {com.timestamp || "Historical Log"} </span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/40 rounded-lg text-xs text-slate-300 font-medium leading-relaxed italic"> &quot;{com.text}&quot; </div>

              {com.replyText && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-lg text-xs text-slate-300 pl-4 border-l-2 border-l-emerald-500 space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 font-mono"> ✦ Station Admin Reply: </div>
                  <p className="font-medium text-slate-200"> &quot;{com.replyText}&quot; </p>
                </div>
              )}

              <div className="flex justify-end items-center space-x-3 text-xs pt-1 border-t border-slate-800/40">
                {activeReplyId !== com.id ? (
                  <button onClick={() => { setActiveReplyId(com.id); setTypedReply(com.replyText || ""); }} className="text-xs font-bold text-slate-400 hover:text-emerald-400 font-sans transition cursor-pointer" > {com.replyText ? "✎ Edit Reply" : "💬 Reply to Comment"} </button>
                ) : (
                  <button onClick={() => setActiveReplyId(null)} className="text-xs font-bold text-slate-500 hover:text-white font-sans transition cursor-pointer" > Cancel </button>
                )}
                <span className="text-slate-700 font-mono">|</span>
                <button onClick={() => handleDeleteComment(com.id)} className="text-xs font-bold text-rose-500/80 hover:text-rose-400 font-sans transition cursor-pointer" > Delete Inappropriate </button>
              </div>

              {activeReplyId === com.id && (
                <form onSubmit={(e) => handleSubmitReply(com.id, e)} className="pt-2 flex items-center space-x-2 form-slide" >
                  <input type="text" required value={typedReply} onChange={(e) => setTypedReply(e.target.value)} placeholder="Type official response context..." className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500 transition" />
                  <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded text-xs cursor-pointer" > Submit Response </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
