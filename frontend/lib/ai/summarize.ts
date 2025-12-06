import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "models/gemini-2.0-flash";
const API_KEY = process.env.GEMINI_API_KEY;

/**
 * Summarizes the given text using the Gemini API.
 *
 * @param text The text to summarize.
 * @returns A promise that resolves to the summarized text, or an error message if summarization fails.
 */
async function summarize(text: string): Promise<string> {
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY environment variable is not set.");
    return "Failed to generate summary: API key not provided.";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Summarize the following text in a concise and informative way. Gunakan bahasa Indonesia dan buat ringkasan minimal 350 karakter. Sertakan informasi tentang judul buku, pencipta buku, ISBN, tahun publikasi, dan jenis buku. Teks: ${text}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.response;

    if (!response.text) {
      console.error("Gemini API returned an empty response.");
      return "Failed to generate summary: Empty response from API.";
    }

    const summary = response.text();
    return summary;
  } catch (error: any) {
    console.error("Error summarizing text:", error);
    return `Failed to generate summary: ${error.message}`;
  }
}

export default summarize;
