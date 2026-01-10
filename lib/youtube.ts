export async function searchYoutube(query: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      console.log("Youtube API Error");
      return null;
    }

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        query
      )}&key=${apiKey}&type=video&videoEmbeddable=true&videoDuration=medium`
    );

    const data = await res.json();

    if (!data.items || data.items.length == 0) {
      console.log("youtube video data items not found");
      return null;
    }

    return data.items[0].id.videoId;
  } catch (error) {
    console.log("Youtube Search Error", error);
    return null;
  }
}
