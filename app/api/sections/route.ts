// 📁 FILE PATH: app/api/sections/route.ts
import { NextResponse } from "next/server";

// Hardcoded default structural layout templates exactly matching document specs
let pageSectionsDatabase = [
  {
    id: "sec-homepage-hero",
    pageName: "Homepage",
    sectionName: "Hero Header Zone",
    title: "The Rhythm of Your Day, Amplified.",
    subtitle: "Independent Digital Web Radio",
    description: "Streaming fresh alternative track mixes, local artist spotlights, and podcasts live 24/7.",
    image: "https://unsplash.com",
    backgroundImage: "https://unsplash.com",
    video: "https://youtube.com"
  },
  {
    id: "sec-about-hero",
    pageName: "About Page",
    sectionName: "Microphone History Banner",
    title: "Behind the Studio Microphone",
    subtitle: "Our Broadcasting Legacy",
    description: "Discover the collective team of engineers, curators, and independent broadcasters shaping audio culture.",
    image: "https://unsplash.com",
    backgroundImage: "https://unsplash.com",
    video: ""
  }
];

export async function GET() {
  return NextResponse.json(pageSectionsDatabase);
}

// Handle updating existing records only
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, subtitle, description, image, backgroundImage, video } = body;
  
  pageSectionsDatabase = pageSectionsDatabase.map(section => {
    if (section.id === id) {
      return { ...section, title, subtitle, description, image, backgroundImage, video };
    }
    return section;
  });
  
  const updatedSection = pageSectionsDatabase.find(s => s.id === id);
  return NextResponse.json(updatedSection);
}
