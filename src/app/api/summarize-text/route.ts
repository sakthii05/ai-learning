import { summarizeText } from "@/lib/prompts";
import { NextResponse } from "next/server";


export const POST = async (req: Request) =>{
try{
const {text} = await req.json()
 if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

     const summary = await summarizeText(text);
     return NextResponse.json({ summary });
}catch(error){
    return NextResponse.json(
        { error: error },
        { status: 500 }
      );
}
}