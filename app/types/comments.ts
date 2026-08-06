export type Comment = {
  id: number;
  name: string;
  body: string;
  is_approved: boolean;
  admin_reply: string;
  created_at: string;
  article: number | null;
  episode: number | null;
};

export type SetCommentApprovalPayload = { id: number; is_approved: boolean };
export type ReplyToCommentPayload = { id: number; admin_reply: string };
