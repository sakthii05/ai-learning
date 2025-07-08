import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from "@xenova/transformers";
import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HF_API_KEY);

export async function POST(request:NextRequest) {
    const { transcript } = await request.json();
    function prepareTextForBART(text:string) {
        // Conservative limit: 3000 chars ≈ 750 tokens
        const MAX_SAFE_LENGTH = 4000;
        
        if (text.length <= MAX_SAFE_LENGTH) {
          return text;
        }
        
        // Truncate at sentence boundary
        const truncated = text.substring(0, MAX_SAFE_LENGTH);
        const lastSentence = truncated.lastIndexOf('.');
        
        return lastSentence > MAX_SAFE_LENGTH * 0.8 
          ? truncated.substring(0, lastSentence + 1)
          : truncated + '...';
      }
    const prompt = `Explain brief text in English:\n\n${prepareTextForBART(transcript)}`;

    const result = await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: prompt,
        // parameters: {
        //   max_length: 150,
        //   min_length: 30,
        //   do_sample: false,
        // }
      });
    // Get the classification pipeline. When called for the first time,
    // this will load the pipeline and cache it for future use.

    // Actually perform the classification
    // const result = await classifier(text);

    return NextResponse.json(result);
}