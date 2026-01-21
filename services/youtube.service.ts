
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

export type YouTubeVideo = {
  videoId: string;
  title: string;
};

export const youtubeService = {
  async searchTopVideo(query: string): Promise<YouTubeVideo | null> {
    const url = new URL(BASE_URL);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "1");
    url.searchParams.set("key", YOUTUBE_API_KEY);

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error("YouTube API request failed");
    }

    const data = await res.json();

    const item = data.items?.[0];
    if (!item) return null;

    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
    };
  },
};
