// 📁 FILE PATH: app/api/episodes/route.ts
import { NextResponse } from "next/server";

let episodesDatabase = [
  {
    id: "ep-1",
    programTitle: "youth talk",
    title: "Freelancing Without Burnout",
    description: "Learn how to manage time, set boundaries with clients, and scale your digital career.",
    thumbnailImage: "https://unsplash.com",
    youtubeLink: "https://youtube.com",
    downloadLink: "https://example.com",
    publishDate: "2026-06-25"
  },
  {
    id: "ep-2",
    programTitle: "morning show",
    title: "Live Studio Session Mix",
    description: "An exclusive morning block featuring local indie track selections and live studio mixing.",
    thumbnailImage: "https://unsplash.com",
    youtubeLink: "https://youtube.com",
    downloadLink: "https://example.com",
    publishDate: "2026-06-28"
  }
];

export async function GET() {
  return NextResponse.json(episodesDatabase);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newEpisode = { id: `ep-${Date.now()}`, ...body };
  episodesDatabase.unshift(newEpisode);
  return NextResponse.json(newEpisode);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, programTitle, title, description, thumbnailImage, youtubeLink, downloadLink, publishDate } = body;
  
  episodesDatabase = episodesDatabase.map(ep => {
    if (ep.id === id) {
      return { ...ep, programTitle, title, description, thumbnailImage, youtubeLink, downloadLink, publishDate };
    }
    return ep;
  });
  
  const updatedEpisode = episodesDatabase.find(e => e.id === id);
  return NextResponse.json(updatedEpisode);
}
