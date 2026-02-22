import { google } from "@ai-sdk/google";
import { createProviderRegistry, customProvider } from "ai";

const customGemini = customProvider({
    languageModels:{
        'gemini-3-flash-preview': google("gemini-3-flash-preview"),
        'gemini-2.5-pro': google("gemini-2.5-pro"),
        'gemini-2.5-flash': google("gemini-2.5-flash"),
        'gemini-2.5-flash-lite': google("gemini-2.5-flash-lite"),
    }
})

export const modelRegistry = createProviderRegistry({
    gemini: customGemini,
})