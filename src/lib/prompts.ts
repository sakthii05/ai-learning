import { PromptTemplate } from "@langchain/core/prompts";
import { groqLLM } from "./llm";
import { FitnessPlanSchema, TextSummarizationSchema} from "./schemas";
import { StructuredOutputParser } from "@langchain/core/output_parsers";


export const textSummarizationPrompt = new PromptTemplate({
  inputVariables: ["text"],
  template: `You are a text summarizer. Given the following text, summarize it in 2-3 sentences.
    {text} {format_instructions}`,
  partialVariables: {
    format_instructions: StructuredOutputParser.fromZodSchema(
      TextSummarizationSchema
    ).getFormatInstructions(),
  },
});

export const summarizeText = async (text: string) => {
  const chain = textSummarizationPrompt.pipe(groqLLM);
  const result = await chain.invoke({ text });
  return result;
};


const planContextPrompt = `You are a fitness and nutrition planning engine.
Your task:
Analyze the provided User Health Info (JSON or text) and generate a safe, realistic fitness plan strictly in JSON format.

GLOBAL RULES:
- Return ONLY valid JSON
- Follow the provided JSON schema exactly
- Do NOT include markdown, comments, or explanations outside JSON
- Use realistic food quantities, calories, and macros
- Respect age, BMI, injuries, medical conditions, activity level, and user preferences
- AI decides training days, rest days, and light activity days
- Diet and workout sections must be user-editable
- Never give medical advice or claims of curing diseases

DIET RULES:
- Each meal (breakfast, lunch, snack, dinner) must contain EXACTLY 4 - 5 options
- Each option must include:
  - quantity
  - calories
  - macros
  - description (practical, non-medical)
- If diet_should_be_local = true:
  - Use foods commonly eaten in the selected country and state
  - Do NOT make all options traditional dishes
  - Per meal:
    - 2-3 options may be regional/state-specific
    - 1-2 options must be commonly consumed across the state (non-traditional, everyday foods)
- Avoid repeating the same traditional dishes across multiple meals
- If the user provided food preferences or dislikes, prioritize them
- Adjust food choices to SUPPORT the user's health conditions and injuries:
  - Focus on digestion-friendly, recovery-supporting, and inflammation-conscious foods
  - Clearly mention foods or cooking methods to avoid (e.g., excess oil, deep-fried, packaged foods)
- Do NOT claim that any food cures medical conditions

WORKOUT RULES:
- Design workouts based on:
  - age
  - injuries
  - medical conditions
  - experience level
  - time available
- If the user has multiple injuries or medical conditions:
  - Reduce workout intensity
  - Prefer low-impact, controlled movements
  - Avoid high-risk or high-impact exercises
- Add warmup exercises before workout and cooldown exercises after workout
- If the user goal is intense (e.g., muscle gain) BUT health risk exists:
  - Prioritize safety over intensity
  - Provide conservative volume
  - Include 1-2 safer alternative exercises for each main exercise
- Light activity days must focus on mobility, recovery, or conditioning
- Never include unsafe exercises for the given injury profile
- On rest days, do light stretching or mobility exercises
- workout_plan object matches correctly with the training_structure - days_per_week, rest_days, light_activity_days 

OUTPUT RULES:
- JSON only
- Values must be consistent across calculations, diet, and workouts
- Explanations inside JSON must be short, practical, and non-medical
- If any required field is unknown, infer a reasonable value instead of omitting it. Never omit required fields.
`

export const fitnessPlanPrompt = new PromptTemplate({
  inputVariables: ["user_prompt"],
  template: ` ${planContextPrompt}
User Health Info:
{user_prompt}

Output Format:
{format_instructions}
`,
  partialVariables: {
    format_instructions:
      StructuredOutputParser.fromZodSchema(
        FitnessPlanSchema
      ).getFormatInstructions(),
  },
});

export const generateFitnessPlan = async (user_prompt: string) => {
  const chain = fitnessPlanPrompt.pipe(groqLLM);
  const result = await chain.invoke({ user_prompt });
  return result;
};

export const reGenerateFitnessPlanPrompt = new PromptTemplate({
  inputVariables: ["user_prompt"],
  template: `
 Context prompt - ${planContextPrompt}
 User Review:
  - Read user review and consider context and user health info and change the what user asked for and make sure you stick to schema and rules.
  - user give reviews only on meal and workout plan

{user_prompt}
 
Output Format:
{format_instructions}
`,
  partialVariables: {
    format_instructions:
      StructuredOutputParser.fromZodSchema(
        FitnessPlanSchema
      ).getFormatInstructions(),
  },
});

export const reGenerateFitnessPlan = async (user_prompt: string) => {
  const chain = reGenerateFitnessPlanPrompt.pipe(groqLLM);
  const result = await chain.invoke({ user_prompt });
  return result;
};
