import { NextRequest, NextResponse } from 'next/server'
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

export async function POST(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) {
        return NextResponse.json({
            error: 'Missing URL parameter',
        }, { status: 400 });
     }
    
    try {
    const loader = YoutubeLoader.createFromUrl(url, {
      language: "en",
      addVideoInfo: true,
    });

    const docs = await loader.load();

    return NextResponse.json({ transcript: docs[0].pageContent });
  } catch (err: any) {
    console.error("Error loading YouTube transcript:", err);
    return NextResponse.json({ error: err.message || "Transcript fetch failed" }, { status: 500 });
  }
}