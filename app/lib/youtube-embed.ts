const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const ALLOWED_HOSTS = new Set(["youtube.com", "www.youtube.com"]);
const ALLOWED_QUERY = new Set(["start", "rel", "controls"]);

export const YOUTUBE_EMBED_HELP = "Paste a YouTube embed URL, for example: https://www.youtube.com/embed/VIDEO_ID";
export const YOUTUBE_EMBED_ERROR = "Enter a valid YouTube embed URL beginning with https://www.youtube.com/embed/.";

export function normalizeYouTubeEmbedUrl(value: string) {
  if (!value.trim()) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname.toLowerCase()) || url.username || url.password || url.port || url.hash) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length !== 2 || segments[0] !== "embed" || !VIDEO_ID_PATTERN.test(segments[1])) return null;
    const keys = [...url.searchParams.keys()];
    if (new Set(keys).size !== keys.length) return null;
    for (const [key, queryValue] of url.searchParams) {
      if (!ALLOWED_QUERY.has(key)) return null;
      if (key === "start" && !/^\d+$/.test(queryValue)) return null;
      if ((key === "rel" || key === "controls") && queryValue !== "0" && queryValue !== "1") return null;
    }
    const query = url.searchParams.toString();
    return `https://www.youtube.com/embed/${segments[1]}${query ? `?${query}` : ""}`;
  } catch {
    return null;
  }
}
