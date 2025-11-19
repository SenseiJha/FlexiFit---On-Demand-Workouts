import { GoogleGenAI } from "@google/genai";

export const generateMotivationalQuote = async (streak: number, userName: string): Promise<string> => {
  try {
    // Ideally, process.env.API_KEY should be set.
    // For this environment, we handle the missing key gracefully if needed, 
    // but following instructions we assume it's there.
    if (!process.env.API_KEY) {
        return `Keep crushing it, ${userName}! Your ${streak} day streak is amazing.`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a very short, punchy, high-energy motivational greeting for a fitness app user named ${userName} who has a ${streak}-day streak. Max 15 words. Use emojis.`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Let's go, ${userName}! Day ${streak} is yours to conquer! 💪`;
  }
};

export const getFlexiCoachAdvice = async (query: string, context: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) return "Keep pushing! Consistency is key.";
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are FlexiCoach, a high-energy, supportive fitness AI assistant. Keep answers concise (under 50 words) and motivational."
            },
            contents: `Context: ${context}. User Question: ${query}`,
        });
        return response.text.trim();
    } catch (error) {
        return "Focus on your form and breathe! You've got this.";
    }
}