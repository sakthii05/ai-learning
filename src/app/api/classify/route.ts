import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from "@xenova/transformers";


export async function GET(request:NextRequest) {
    const text = request.nextUrl.searchParams.get('text');
    if (!text) {
        return NextResponse.json({
            error: 'Missing text parameter',
        }, { status: 400 });


    }
    const detector = await pipeline("text-classification", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
    const output = await detector(text);
    // Get the classification pipeline. When called for the first time,
    // this will load the pipeline and cache it for future use.

    // Actually perform the classification
    // const result = await classifier(text);

    return NextResponse.json(output);
}