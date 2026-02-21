import { convertToModelMessages, streamText, UIMessage,tool} from 'ai';
import {groq} from "@ai-sdk/groq"
import { google } from "@ai-sdk/google";
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

export async function POST(req: Request) {
  try{
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT =`You are a friendly, human-like AI assistant.
Always format responses using clean Markdown with:
- Headings
- Bullet points
- Code blocks with language
- Tables when needed.
- Make response shorter and concise.
Include icons if needed:
- Use 💡 for tips
- Use ⚠️ for warnings
- Use ✅ for success
- Use 🚀 for sections
- Use ❌ for errors or DO NOT USE
Avoid unnecessary formatting.`
  //google('gemini-2.5-flash'),
    //groq('llama-3.1-8b-instant')

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens:2000
  });

  return result.toUIMessageStreamResponse();
} catch (error) {
  console.error(error);
  return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
}}