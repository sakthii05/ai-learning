import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";


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


export const getTranscript = async(videoId: string) =>{
  const loader = YoutubeLoader.createFromUrl("https://youtu.be/bZQun8Y4L2A", {
    language: "en",
    addVideoInfo: true,
  });
  
  const docs = await loader.load();
  
  console.log(docs);
}