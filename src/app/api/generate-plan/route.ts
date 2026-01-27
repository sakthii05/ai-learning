import { generateFitnessPlan, reGenerateFitnessPlan} from "@/lib/prompts";
import { NextResponse } from "next/server";


export const POST = async (req: Request) =>{
try{
const {user }= await req.json()
 if (!user) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }
     const plan = user.type === "generate" ?  await generateFitnessPlan(user.userInfo) :  await reGenerateFitnessPlan(user.userInfo);
     return NextResponse.json({ plan });
}catch(error){
    console.log(error)
    return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
}
}