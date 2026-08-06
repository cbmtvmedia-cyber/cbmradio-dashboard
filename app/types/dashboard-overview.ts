export type DashboardOverviewCounts = {
  programs: number;
  episodes: number;
  articles: number;
  gallery_items: number;
  published_articles: number;
  draft_articles: number;
  comments: number;
};

export type DashboardArticleSummary = {
  id: number; title: string; slug: string; cover_image: string; author: string;
  is_featured: boolean; is_published: boolean; published_at: string | null;
};

export type DashboardEpisodeSummary = {
  id: number; program_id: number; program_title: string; title: string;
  description: string; cover_image: string; youtube_link: string;
  publish_date: string | null; is_featured: boolean; is_active: boolean;
};

export type DashboardCommentSummary = {
  id: number; name: string; body: string; article: number | null;
  episode: number | null; is_approved: boolean; admin_reply: string;
  created_at: string;
};

export type DashboardOverview = {
  counts: DashboardOverviewCounts;
  latest_article: DashboardArticleSummary | null;
  latest_episode: DashboardEpisodeSummary | null;
  recent_articles: DashboardArticleSummary[];
  recent_episodes: DashboardEpisodeSummary[];
  recent_comments: DashboardCommentSummary[];
};

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function numberField(value: unknown) { return typeof value === "number" && Number.isFinite(value); }
function stringField(value: unknown) { return typeof value === "string"; }
function nullableString(value: unknown) { return value === null || stringField(value); }
function nullableNumber(value: unknown) { return value === null || numberField(value); }
function article(value: unknown): value is DashboardArticleSummary { const item=record(value); return Boolean(item&&numberField(item.id)&&stringField(item.title)&&stringField(item.slug)&&stringField(item.cover_image)&&stringField(item.author)&&typeof item.is_featured==="boolean"&&typeof item.is_published==="boolean"&&nullableString(item.published_at)); }
function episode(value: unknown): value is DashboardEpisodeSummary { const item=record(value); return Boolean(item&&numberField(item.id)&&numberField(item.program_id)&&stringField(item.program_title)&&stringField(item.title)&&stringField(item.description)&&stringField(item.cover_image)&&stringField(item.youtube_link)&&nullableString(item.publish_date)&&typeof item.is_featured==="boolean"&&typeof item.is_active==="boolean"); }
function comment(value: unknown): value is DashboardCommentSummary { const item=record(value); return Boolean(item&&numberField(item.id)&&stringField(item.name)&&stringField(item.body)&&nullableNumber(item.article)&&nullableNumber(item.episode)&&typeof item.is_approved==="boolean"&&stringField(item.admin_reply)&&stringField(item.created_at)); }

export function isDashboardOverview(value: unknown): value is DashboardOverview {
  const data=record(value); const counts=record(data?.counts);
  const countKeys: (keyof DashboardOverviewCounts)[]=["programs","episodes","articles","gallery_items","published_articles","draft_articles","comments"];
  return Boolean(data&&counts&&countKeys.every((key)=>numberField(counts[key]))&&(data.latest_article===null||article(data.latest_article))&&(data.latest_episode===null||episode(data.latest_episode))&&Array.isArray(data.recent_articles)&&data.recent_articles.every(article)&&Array.isArray(data.recent_episodes)&&data.recent_episodes.every(episode)&&Array.isArray(data.recent_comments)&&data.recent_comments.every(comment));
}
