
export const getVideoInfo = async (videoId: string) => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const item = data.items[0];
    return {
      duration: item.contentDetails.duration, // e.g., "PT50M12S"
      title: item.snippet.title,
    };
  }

