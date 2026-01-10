export async function searchYoutube(query: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    // 1. Defenisve Check
    if (!apiKey) return null;

    // STRATEGY 1: Strict Search (Best Quality)
    // - Shorts excluded
    // - Medium duration (4-20 mins)
    // - Embeddable only
    const strictQuery = `${query} tutorial -shorts`;
    const strictUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      strictQuery
    )}&key=${apiKey}&type=video&videoEmbeddable=true&videoDuration=medium`;

    let res = await fetch(strictUrl);
    let data = await res.json();

    // If Strict search worked, return it
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }

    // STRATEGY 2: Fallback / Loose Search (If strict failed)
    // - Remove duration filter
    // - Remove "-shorts" (better to show a short than nothing)
    console.log("Strict search failed, trying loose search...");
    const looseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      query + " tutorial"
    )}&key=${apiKey}&type=video&videoEmbeddable=true`; // Still keep embeddable to prevent broken players

    res = await fetch(looseUrl);
    data = await res.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }

    return null;
  } catch (error) {
    console.error("Youtube Search Error", error);
    return null;
  }
}