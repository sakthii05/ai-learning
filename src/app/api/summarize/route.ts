import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from "@xenova/transformers";


export async function POST(request:NextRequest) {
    const { transcript } = await request.json();
 
    const prompt = `Summarize this text in English:\n\n${transcript}`;
    const summarizer = await pipeline("summarization","facebook/bart-large-cnn");
    const output = await summarizer(prompt);
    console.log(output)
    // Get the classification pipeline. When called for the first time,
    // this will load the pipeline and cache it for future use.

    // Actually perform the classification
    // const result = await classifier(text);

    return NextResponse.json(output);
}