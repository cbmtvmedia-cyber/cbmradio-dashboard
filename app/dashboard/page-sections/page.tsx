"use client";

import React, { useEffect, useState } from "react";
import Toast from "../../components/toast";
import { extractApiError, SiteImageFields } from "../../components/site-image-fields";

const sectionKeys = ["hero", "about", "mission", "vision", "contact", "footer", "sponsors", "gallery"];

interface Section {
  id: string;
  sectionName: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  externalImage?: string;
  cta_label: string;
  cta_url: string;
  is_active: boolean;
  order: number;
}

interface SectionForm {
  sectionKey: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
  order: number;
}

const emptyForm: SectionForm = {
  sectionKey: "gallery",
  title: "",
  subtitle: "",
  body: "",
  image: "",
  ctaLabel: "",
  ctaUrl: "",
  isActive: true,
  order: 0,
};

export default function PageSectionsPage() {
  const [list, setList] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Section | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<SectionForm>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((response) => response.json())
      .then((data) => setList(data.results || []))
      .finally(() => setLoading(false));
  }, []);

  const updateForm = <K extends keyof SectionForm>(key: K, value: SectionForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    const available = sectionKeys.find((key) => !list.some((section) => section.id === key));
    if (!available) {
      setToast("All supported page sections already exist.");
      return;
    }
    setEditing(null);
    setCreating(true);
    setForm({ ...emptyForm, sectionKey: available });
    setSelectedFile(null);
    setFormError("");
  };

  const openEdit = (section: Section) => {
    setCreating(false);
    setEditing(section);
    setForm({
      sectionKey: section.id,
      title: section.title,
      subtitle: section.subtitle,
      body: section.description,
      image: section.externalImage || "",
      ctaLabel: section.cta_label || "",
      ctaUrl: section.cta_url || "",
      isActive: section.is_active,
      order: section.order || 0,
    });
    setSelectedFile(null);
    setFormError("");
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setSelectedFile(null);
    setFormError("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const body = new FormData();
    body.set("section_key", form.sectionKey);
    body.set("title", form.title);
    body.set("subtitle", form.subtitle);
    body.set("body", form.body);
    body.set("image", form.image);
    body.set("cta_label", form.ctaLabel);
    body.set("cta_url", form.ctaUrl);
    body.set("is_active", String(form.isActive));
    body.set("order", String(form.order));
    if (selectedFile) body.set("uploaded_image", selectedFile);

    const response = await fetch("/api/sections", {
      method: creating ? "POST" : "PUT",
      body,
    });
    if (!response.ok) {
      setFormError(await extractApiError(response));
      return;
    }
    const saved = await response.json();
    setList((current) =>
      creating ? [...current, saved] : current.map((section) => section.id === saved.id ? saved : section),
    );
    setToast(creating ? "Page section created." : "Page section updated.");
    closeForm();
  };

  if (loading) return <div className="p-4 text-xs text-slate-500">Loading page sections...</div>;
  const showingForm = creating || editing;

  return (
    <div className="space-y-6">
      <Toast message={toast} />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Page Sections</h1>
          <p className="text-xs text-slate-400">Create missing sections or edit existing content.</p>
        </div>
        <button onClick={openCreate} className="rounded bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950">Add page section</button>
      </div>

      {showingForm && (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 text-xs md:grid-cols-2">
          <div className="space-y-3">
            <label className="block">Section key
              <select disabled={!creating} value={form.sectionKey} onChange={(e) => updateForm("sectionKey", e.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2">
                {sectionKeys.filter((key) => key === form.sectionKey || !list.some((section) => section.id === key)).map((key) => <option key={key}>{key}</option>)}
              </select>
            </label>
            <label className="block">Title *<input required value={form.title} onChange={(e) => updateForm("title", e.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2" /></label>
            <label className="block">Subtitle<input value={form.subtitle} onChange={(e) => updateForm("subtitle", e.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2" /></label>
            <label className="block">Body<textarea rows={5} value={form.body} onChange={(e) => updateForm("body", e.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2" /></label>
          </div>
          <div className="space-y-3">
            <SiteImageFields currentUrl={editing?.image} externalUrl={form.image} file={selectedFile} onExternalUrlChange={(value) => updateForm("image", value)} onFileChange={setSelectedFile} />
            <label className="block">CTA label<input value={form.ctaLabel} onChange={(e) => updateForm("ctaLabel", e.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2" /></label>
            <label className="block">CTA URL<input type="url" value={form.ctaUrl} onChange={(e) => updateForm("ctaUrl", e.target.value)} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2" /></label>
            <label className="block">Order<input type="number" min="0" value={form.order} onChange={(e) => updateForm("order", Number(e.target.value))} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 p-2" /></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => updateForm("isActive", e.target.checked)} /> Active</label>
            <div className="flex justify-end gap-2"><button type="button" onClick={closeForm} className="rounded bg-slate-800 px-4 py-2">Cancel</button><button type="submit" className="rounded bg-emerald-500 px-4 py-2 font-bold text-slate-950">{creating ? "Create" : "Save"}</button></div>
            {formError && <p className="text-rose-400">{formError}</p>}
          </div>
        </form>
      )}

      <div className="space-y-3">
        {list.map((section) => (
          <div key={section.id} className="flex items-start justify-between rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div><p className="text-xs uppercase text-emerald-400">{section.sectionName}</p><h2 className="mt-1 font-bold text-white">{section.title}</h2><p className="mt-2 text-xs text-slate-400">{section.description}</p></div>
            <button onClick={() => openEdit(section)} className="text-xs font-bold text-emerald-400">Edit</button>
          </div>
        ))}
        {list.length === 0 && <p className="rounded border border-slate-800 p-6 text-center text-sm text-slate-500">No page sections exist yet.</p>}
      </div>
    </div>
  );
}