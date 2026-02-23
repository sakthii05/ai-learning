import { convertToModelMessages, streamText, UIMessage,tool} from 'ai';
import { modelRegistry } from '@/lib/model';

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

export async function POST(req: Request) {
  try{
  const { messages,model,temperature,systemPrompt }: { messages: UIMessage[],model:string,temperature:number,systemPrompt:string } = await req.json();

  const SYSTEM_PROMPT =`${systemPrompt}
  Use below format when needed:
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
-Always follow the instructions given by the user. 
-Important: Always format responses using clean Markdown,
-Avoid unnecessary formatting.`
 
 const result = streamText({
    model: modelRegistry.languageModel(`gemini:${model}`),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature:temperature,
  });

  return result.toUIMessageStreamResponse();
} catch (error) {
  console.error(error);
  return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
}}