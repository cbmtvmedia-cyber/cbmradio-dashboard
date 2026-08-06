import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { DashboardArticleSummary, DashboardCommentSummary, DashboardEpisodeSummary } from "../../types/dashboard-overview";
import { Card, EmptyState, StatusBadge } from "../ui/surfaces";

export function OverviewMetricCard({ label, value, href, icon }: { label:string; value:number; href:string; icon:ReactNode }) {
  return <Link href={href} className="overview-metric-link" aria-label={`${label}: ${value}. Manage ${label}.`}><Card className="overview-metric-card"><div><span>{label}</span><span aria-hidden="true">{icon}</span></div><strong>{value.toLocaleString()}</strong><small>Manage {label}</small></Card></Link>;
}

function dateValue(value:string|null) {
  if(!value)return null;const date=new Date(value);if(Number.isNaN(date.getTime()))return null;
  return new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(date);
}
function DateDisplay({ value }: { value:string|null }) { const formatted=dateValue(value); return formatted?<time dateTime={value||undefined}>{formatted}</time>:<span>Date unavailable</span>; }
function ImageOrFallback({ src, alt }: { src:string; alt:string }) { return <div className="overview-content-image">{src.trim()?<Image src={src} alt={alt} fill unoptimized sizes="(max-width: 768px) 100vw, 320px" className="object-cover"/>:<span aria-hidden="true">No image</span>}</div>; }

export function LatestArticleCard({ article }: { article:DashboardArticleSummary|null }) {
  return <Card className="overview-feature-card"><h2>Latest published article</h2>{article?<><ImageOrFallback src={article.cover_image} alt={`Cover for ${article.title}`}/><div className="overview-feature-body"><div className="overview-title-row"><h3>{article.title}</h3><StatusBadge status="published" label="Published"/></div><p>{article.author||"Author unavailable"}</p><DateDisplay value={article.published_at}/><Link href="/dashboard/articles">Manage articles</Link></div></>:<EmptyState title="No published articles" description="No published articles are available yet."/>}</Card>;
}

export function LatestEpisodeCard({ episode }: { episode:DashboardEpisodeSummary|null }) {
  return <Card className="overview-feature-card"><h2>Latest episode</h2>{episode?<><ImageOrFallback src={episode.cover_image} alt={`Cover for ${episode.title}`}/><div className="overview-feature-body"><div className="overview-title-row"><h3>{episode.title}</h3><StatusBadge status={episode.is_active?"active":"inactive"}/></div><p>{episode.program_title||"Program unavailable"}</p><DateDisplay value={episode.publish_date}/><Link href="/dashboard/episodes">Manage episodes</Link></div></>:<EmptyState title="No active episodes" description="No active episodes are available yet."/>}</Card>;
}

export function RecentArticles({ articles }: { articles:DashboardArticleSummary[] }) { return <OverviewList title="Recent articles" href="/dashboard/articles" empty="No recent articles are available.">{articles.map((item)=><li key={item.id}><div><strong>{item.title}</strong><span>{item.author||"Author unavailable"}</span></div><div><StatusBadge status={item.is_published?"published":"draft"}/><DateDisplay value={item.published_at}/></div></li>)}</OverviewList>; }
export function RecentEpisodes({ episodes }: { episodes:DashboardEpisodeSummary[] }) { return <OverviewList title="Recent episodes" href="/dashboard/episodes" empty="No recent episodes are available.">{episodes.map((item)=><li key={item.id}><div><strong>{item.title}</strong><span>{item.program_title||"Program unavailable"}</span></div><div><StatusBadge status={item.is_active?"active":"inactive"}/><DateDisplay value={item.publish_date}/></div></li>)}</OverviewList>; }
export function RecentComments({ comments }: { comments:DashboardCommentSummary[] }) { return <OverviewList title="Recent comments" href="/dashboard/comments" empty="No recent comments are available.">{comments.map((item)=><li key={item.id}><div><strong>{item.name||"Unnamed commenter"}</strong><span className="overview-comment-preview">{item.body}</span><small>{item.article!==null?`Article #${item.article}`:item.episode!==null?`Episode #${item.episode}`:"Unknown content"}</small></div><div><StatusBadge status={item.is_approved?"approved":"pending"} label={item.is_approved?"Approved":"Pending"}/><DateDisplay value={item.created_at}/></div></li>)}</OverviewList>; }

function OverviewList({ title, href, empty, children }: { title:string; href:string; empty:string; children:ReactNode }) { const hasItems=Array.isArray(children)?children.length>0:Boolean(children);return <Card className="overview-list"><header><h2>{title}</h2><Link href={href}>View all</Link></header>{hasItems?<ul>{children}</ul>:<EmptyState title={empty}/>}</Card>; }
