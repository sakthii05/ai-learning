import { generateFitnessPlan} from "@/lib/prompts";
import { NextResponse } from "next/server";


export const POST = async (req: Request) =>{
try{
const {userInfo }= await req.json()
 if (!userInfo) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

     const plan = await generateFitnessPlan(userInfo);
     return NextResponse.json({ plan });
}catch(error){
    console.log(error)
    return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
}
}