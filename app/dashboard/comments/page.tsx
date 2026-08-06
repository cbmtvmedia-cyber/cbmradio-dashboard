"use client";

import { MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Toast, { type ToastVariant } from "../../components/toast";
import { Button } from "../../components/ui/button";
import { ConfirmationDialog } from "../../components/ui/confirmation-dialog";
import { Input, Textarea } from "../../components/ui/form-controls";
import { Pagination } from "../../components/ui/pagination";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from "../../components/ui/surfaces";
import { apiClient, isApiError } from "../../lib/api-client";
import type { PaginatedResponse } from "../../types/api";
import type { Comment, ReplyToCommentPayload, SetCommentApprovalPayload } from "../../types/comments";

type ToastState = { message: string; variant: ToastVariant } | null;
const emptyPage: PaginatedResponse<Comment> = { count: 0, next: null, previous: null, results: [] };

function formatCommentDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function commentAssociation(comment: Comment) {
  if (comment.article !== null) return `Article #${comment.article}`;
  if (comment.episode !== null) return `Episode #${comment.episode}`;
  return "Unknown content";
}

export default function CommentsPage() {
  const [data, setData] = useState(emptyPage);
  const [requestPage, setRequestPage] = useState(1);
  const [displayedPage, setDisplayedPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [approvalId, setApprovalId] = useState<number | null>(null);
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [replying, setReplying] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  const loadComments = useCallback(async (page: number, query: string, signal?: AbortSignal) => {
    const params = new URLSearchParams({ page: String(page) });
    if (query.trim()) params.set("search", query.trim());
    return apiClient.get<PaginatedResponse<Comment>>(`/api/comments?${params}`, { signal });
  }, []);

  const refresh = useCallback(async () => {
    setRetrying(true);
    setLoadError("");
    try {
      const response = await loadComments(displayedPage, search);
      setData(response);
      setRequestPage(displayedPage);
    } catch (error) {
      setLoadError(isApiError(error) ? error.message : "Unable to reach the comments service.");
    } finally {
      setRetrying(false);
      setLoading(false);
      setPageLoading(false);
    }
  }, [displayedPage, loadComments, search]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setPageLoading(true);
      loadComments(requestPage, search, controller.signal)
        .then((response) => {
          setData(response);
          setDisplayedPage(requestPage);
          setLoadError("");
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setLoadError(isApiError(error) ? error.message : "Unable to reach the comments service.");
          setLoading(false);
        })
        .finally(() => setPageLoading(false));
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [loadComments, requestPage, search]);

  const replaceComment = (updated: Comment) => setData((current) => ({ ...current, results: current.results.map((comment) => comment.id === updated.id ? updated : comment) }));

  const setApproval = async (comment: Comment) => {
    if (approvalId !== null) return;
    setApprovalId(comment.id);
    try {
      const payload: SetCommentApprovalPayload = { id: comment.id, is_approved: !comment.is_approved };
      replaceComment(await apiClient.patch<Comment>("/api/comments", payload));
      setToast({ message: `Comment from ${comment.name} ${comment.is_approved ? "returned to pending" : "approved"}.`, variant: "success" });
    } catch (error) {
      setToast({ message: isApiError(error) ? error.message : "Unable to approve the comment.", variant: "error" });
    } finally {
      setApprovalId(null);
    }
  };

  const openReply = (comment: Comment) => {
    setReplyId(comment.id);
    setReplyText(comment.admin_reply);
    setReplyError("");
  };

  const submitReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (replyId === null || replying) return;
    const reply = replyText.trim();
    if (!reply) { setReplyError("Enter an administrative reply before saving."); return; }
    setReplying(true);
    setReplyError("");
    try {
      const payload: ReplyToCommentPayload = { id: replyId, admin_reply: reply };
      replaceComment(await apiClient.patch<Comment>("/api/comments", payload));
      setReplyId(null);
      setReplyText("");
      setToast({ message: "Administrative reply saved.", variant: "success" });
    } catch (error) {
      if (isApiError(error)) setReplyError(error.fieldErrors?.admin_reply?.[0] || error.message);
      else setReplyError("Unable to save the administrative reply.");
    } finally {
      setReplying(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await apiClient.delete<void>(`/api/comments?id=${encodeURIComponent(String(deleteTarget.id))}`);
      setToast({ message: `Comment from ${deleteTarget.name} deleted.`, variant: "success" });
      setDeleteTarget(null);
      if (data.results.length === 1 && displayedPage > 1) setRequestPage(displayedPage - 1);
      else await refresh();
    } catch (error) {
      setDeleteError(isApiError(error) ? error.message : "Unable to delete the comment.");
    } finally {
      setDeleting(false);
    }
  };

  return <div className="comments-page view-fade">
    <Toast message={toast?.message || null} variant={toast?.variant} onDismiss={() => setToast(null)} />
    <PageHeader title="Visitor Comments" description="Review real listener comments, approvals, and administrative replies." />
    <div className="comments-filters"><Input label="Search comments" value={search} onChange={(event) => { setSearch(event.target.value); setRequestPage(1); }} placeholder="Search commenter name or comment body" /></div>
    {loading ? <LoadingState label="Fetching comments…" /> : loadError && !data.results.length ? <ErrorState message={loadError} onRetry={() => void refresh()} retrying={retrying} /> : data.results.length === 0 ? <EmptyState icon={<MessageSquare />} title={search ? "No matching comments" : "No comments yet"} description={search ? "Try a different name or phrase." : "The backend returned no listener comments."} /> : <>
      <div className={`comments-list ${pageLoading ? "is-loading" : ""}`} aria-busy={pageLoading}>
        {data.results.map((comment) => { const formattedDate = formatCommentDate(comment.created_at); return <Card key={comment.id} className="comment-card">
          <header><div><div className="comment-identity"><h2>{comment.name || "Unnamed commenter"}</h2><StatusBadge status={comment.is_approved ? "approved" : "pending"} label={comment.is_approved ? "Approved" : "Pending approval"} /></div><p>{commentAssociation(comment)}</p></div>{formattedDate ? <time dateTime={comment.created_at}>{formattedDate}</time> : <span className="comment-date-fallback">Date unavailable</span>}</header>
          <blockquote>{comment.body}</blockquote>
          {comment.admin_reply && <section className="comment-existing-reply"><h3>Administrative reply</h3><p>{comment.admin_reply}</p></section>}
          <div className="comment-actions"><Button variant={comment.is_approved ? "outline" : "primary"} onClick={() => void setApproval(comment)} loading={approvalId === comment.id} loadingLabel={comment.is_approved ? "Unapproving…" : "Approving…"} disabled={approvalId !== null}>{comment.is_approved ? "Unapprove comment" : "Approve comment"}</Button><Button variant="outline" onClick={() => openReply(comment)} disabled={replying}>{comment.admin_reply ? "Edit administrative reply" : "Add administrative reply"}</Button><Button variant="destructive" onClick={() => { setDeleteError(""); setDeleteTarget(comment); }} disabled={deleting}>Delete comment</Button></div>
          {replyId === comment.id && <form onSubmit={submitReply} className="comment-reply-form"><Textarea label="Administrative reply" value={replyText} onChange={(event) => setReplyText(event.target.value)} error={replyError} rows={4} required disabled={replying} helperText="This saves a staff reply on the comment record; it does not imply email delivery." /><div><Button variant="outline" onClick={() => { setReplyId(null); setReplyError(""); }} disabled={replying}>Cancel</Button><Button type="submit" loading={replying} loadingLabel="Saving reply…">Save reply</Button></div></form>}
        </Card>; })}
      </div>
      {loadError && <ErrorState message={loadError} onRetry={() => void refresh()} retrying={retrying} />}
      <Pagination count={data.count} currentPage={displayedPage} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} loading={pageLoading} onNext={() => setRequestPage(displayedPage + 1)} onPrevious={() => setRequestPage(Math.max(1, displayedPage - 1))} />
    </>}
    <ConfirmationDialog open={Boolean(deleteTarget)} title="Delete comment?" description={deleteTarget ? `Permanently delete the comment from ${deleteTarget.name}? This action cannot be undone.` : ""} loading={deleting} error={deleteError} onConfirm={() => void remove()} onCancel={() => { if (!deleting) { setDeleteTarget(null); setDeleteError(""); } }} />
  </div>;
}
