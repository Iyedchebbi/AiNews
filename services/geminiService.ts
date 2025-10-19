// Implemented Gemini API call to generate real article summaries.
import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, initialize the Gemini client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeArticle = async (title: string, description: string | null): Promise<string> => {
  // Construct a clear prompt for summarization.
  const prompt = `Provide a concise and engaging summary of the following news article. Focus on the key information that a reader would want to know.
  
  Title: ${title}
  Description: ${description || 'N/A'}`;

  try {
    // Per guidelines, use gemini-2.5-flash for basic text tasks and call generateContent.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert news summarizer. Your summaries are clear, concise, and capture the essence of the article for a general audience."
      }
    });

    // Per guidelines, access the text directly from the response.
    return response.text;
  } catch (error) {
    console.error("Error summarizing article with Gemini:", error);
    // Provide a more informative error message for the UI.
    throw new Error("The AI summary could not be generated at this time. Please try again later.");
  }
};
