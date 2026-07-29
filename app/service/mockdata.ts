import {PageSection, TeamMember, RadioProgram, Episode} from "../types"; 

export const initialPageSections: PageSection[] = [
  { id: "sec-1", pageName: "Homepage", sectionName: "Homepage hero sections", title: "The Rhythm of Your Day, Amplified.", subtitle: "Streaming fresh online audio 24/7." },
  { id: "sec-2", pageName: "About Page", sectionName: "About page hero sections", title: "Behind the Studio Microphone", subtitle: "Discover our independent web operations history." }
];

export const initialTeamMembers: TeamMember[] = [
  { id: "team-1", name: "Marcus Vance", role: "Station Director", category: "Leadership" },
  { id: "team-2", name: "Sarah Jenkins", role: "Morning Show Host", category: "Presenters" }
];

export const initialPrograms: RadioProgram[] = [
  { id: "prog-1", title: "morning show", description: "Wake-up block music and comedy slots.", presenterName: "Sarah Jenkins" },
  { id: "prog-2", title: "youth talk", description: "Discussions touching on culture and careers.", presenterName: "Sarah Jenkins" },
  { id: "prog-3", title: "worship hour", description: "Gospel rhythms and Sunday reflection.", presenterName: "Marcus Vance" }
];

export const initialEpisodes: Episode[] = [
  { id: "ep-1", programTitle: "youth talk", title: "Freelancing Without Burnout", youtubeLink: "https://youtube.com", publishDate: "2026-06-25" },
  { id: "ep-2", programTitle: "morning show", title: "Live Studio Session Mix", youtubeLink: "https://youtube.com", publishDate: "2026-06-28" }
];
export const initialArticles: { id: string; title: string; content: string; publishDate: string }[] = [
  { id: "art-1", title: "New Studio Launch", content: "We are thrilled to announce the launch of our new state-of-the-art studio, enhancing our broadcast quality and listener experience.", publishDate: "2026-06-20" },
  { id: "art-2", title: "Community Outreach Program", content: "Our station is proud to initiate a community outreach program aimed at supporting local artists and musicians.", publishDate: "2026-06-22" }
];
export const initialGallery: { id: string; imageUrl: string; caption: string }[] = [
  { id: "gal-1", imageUrl: "/images/studio.jpg", caption: "Inside our new studio." },
  { id: "gal-2", imageUrl: "/images/community-event.jpg", caption: "Community outreach event." }
];
export const initialComments: { id: string; userName: string; commentText: string; datePosted: string }[] = [
  { id: "com-1", userName: "Listener123", commentText: "Love the new morning show segment!", datePosted: "2026-06-23" },
  { id: "com-2", userName: "MusicFan", commentText: "The worship hour is so uplifting!", datePosted: "2026-06-24" }
];
