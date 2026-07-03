export interface PageSection {
  id: string;
  pageName: "Homepage" | "About Page" | "Team Page" | "News Page";
  sectionName: string;
  title: string;
  subtitle: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Leadership" | "Presenters" | "Producers" | "Contributors";
}

export interface RadioProgram {
  id: string;
  title: string;
  description: string;
  presenterName: string;
}

export interface Episode {
  id: string;
  programTitle: string;
  title: string;
  youtubeLink: string;
  publishDate: string;
}
