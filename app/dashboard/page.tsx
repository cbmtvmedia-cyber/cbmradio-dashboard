"use client";

import { FileCheck2, FilePenLine, GalleryHorizontal, MessageSquare, Newspaper, Radio, ScrollText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LatestArticleCard, LatestEpisodeCard, OverviewMetricCard, RecentArticles, RecentComments, RecentEpisodes } from "../components/dashboard/overview-cards";
import { ButtonLink } from "../components/ui/button";
import { Card, ErrorState, LoadingState, PageHeader } from "../components/ui/surfaces";
import { apiClient, isApiError } from "../lib/api-client";
import { isDashboardOverview, type DashboardOverview } from "../types/dashboard-overview";

export default function DashboardPage() {
  const [overview,setOverview]=useState<DashboardOverview|null>(null);
  const [loading,setLoading]=useState(true);
  const [retrying,setRetrying]=useState(false);
  const [error,setError]=useState("");
  const controllerRef=useRef<AbortController|null>(null);
  const requestIdRef=useRef(0);

  const loadOverview=useCallback(async(retry:boolean)=>{
    controllerRef.current?.abort();const controller=new AbortController();controllerRef.current=controller;const requestId=++requestIdRef.current;
    if(retry)setRetrying(true);setError("");
    try{const response=await apiClient.get<unknown>("/api/dashboard/overview",{signal:controller.signal});if(!isDashboardOverview(response))throw new Error("The overview service returned an unexpected response.");if(requestId===requestIdRef.current)setOverview(response);}
    catch(requestError){if(requestError instanceof DOMException&&requestError.name==="AbortError")return;if(requestId===requestIdRef.current)setError(isApiError(requestError)?requestError.message:requestError instanceof Error?requestError.message:"Unable to load the dashboard overview.");}
    finally{if(requestId===requestIdRef.current){setLoading(false);setRetrying(false);}}
  },[]);

  useEffect(()=>{const timer=window.setTimeout(()=>void loadOverview(false),0);return()=>{window.clearTimeout(timer);requestIdRef.current+=1;controllerRef.current?.abort();};},[loadOverview]);

  if(loading)return <LoadingState label="Loading dashboard overviewâ€¦"/>;
  if(error&&!overview)return <ErrorState title="Dashboard overview unavailable" message={error} onRetry={()=>void loadOverview(true)} retrying={retrying}/>;
  if(!overview)return <ErrorState title="Dashboard overview unavailable" message="No overview data is available." onRetry={()=>void loadOverview(true)} retrying={retrying}/>;

  const {counts}=overview;
  return <div className="overview-page view-fade">
    <PageHeader title="Dashboard Overview" description="A current summary of CBM Radio content and moderation records." />
    {error&&<ErrorState title="Unable to refresh overview" message={error} onRetry={()=>void loadOverview(true)} retrying={retrying}/>}
    <section aria-labelledby="overview-counts-title"><h2 id="overview-counts-title" className="overview-section-title">Content totals</h2><div className="overview-metrics">
      <OverviewMetricCard label="Programs" value={counts.programs} href="/dashboard/programs" icon={<Radio/>}/>
      <OverviewMetricCard label="Episodes" value={counts.episodes} href="/dashboard/episodes" icon={<ScrollText/>}/>
      <OverviewMetricCard label="Articles" value={counts.articles} href="/dashboard/articles" icon={<Newspaper/>}/>
      <OverviewMetricCard label="Gallery Items" value={counts.gallery_items} href="/dashboard/gallery" icon={<GalleryHorizontal/>}/>
      <OverviewMetricCard label="Published Articles" value={counts.published_articles} href="/dashboard/articles" icon={<FileCheck2/>}/>
      <OverviewMetricCard label="Draft Articles" value={counts.draft_articles} href="/dashboard/articles" icon={<FilePenLine/>}/>
      <OverviewMetricCard label="Comments" value={counts.comments} href="/dashboard/comments" icon={<MessageSquare/>}/>
    </div></section>
    <section aria-labelledby="overview-latest-title"><h2 id="overview-latest-title" className="overview-section-title">Latest content</h2><div className="overview-latest"><LatestArticleCard article={overview.latest_article}/><LatestEpisodeCard episode={overview.latest_episode}/></div></section>
    <section aria-labelledby="overview-recent-title"><h2 id="overview-recent-title" className="overview-section-title">Recent records</h2><div className="overview-recent"><RecentArticles articles={overview.recent_articles}/><RecentEpisodes episodes={overview.recent_episodes}/><RecentComments comments={overview.recent_comments}/></div></section>
    <Card className="overview-actions"><h2>Quick actions</h2><div><ButtonLink href="/dashboard/programs" variant="outline">Manage Programs</ButtonLink><ButtonLink href="/dashboard/episodes" variant="outline">Manage Episodes</ButtonLink><ButtonLink href="/dashboard/articles" variant="outline">Manage Articles</ButtonLink><ButtonLink href="/dashboard/gallery" variant="outline">Manage Gallery</ButtonLink><ButtonLink href="/dashboard/comments" variant="outline">Moderate Comments</ButtonLink><ButtonLink href="/dashboard/page-sections" variant="outline">Manage Page Sections</ButtonLink></div></Card>
  </div>;
}
