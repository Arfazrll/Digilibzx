import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

const MODELS = [
  "gemini-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
];

async function tryGenerateWithModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string
): Promise<string | null> {
  try {
    console.log(`Mencoba model: ${modelName}`);

    const model = genAI.getGenerativeModel({ model: modelName });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    if (text && text.trim().length > 0) {
      console.log(`Berhasil dengan model: ${modelName}`);
      return text.trim();
    }

    return null;
  } catch (error: any) {
    console.error(`Model ${modelName} gagal:`, error.message);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, minLength = 200, maxLength = 500, language = "id" } = body;

    if (!API_KEY) {
      console.error("GEMINI_API_KEY tidak ditemukan");
      return NextResponse.json(
        {
          error: "API key tidak dikonfigurasi di server",
          solution: "Set GEMINI_API_KEY di .env.local dan restart server",
        },
        { status: 500 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Tidak ada teks untuk diringkas" },
        { status: 400 }
      );
    }

    console.log("Starting summarization...");

    const languageInstruction = language === "id" ? "dalam Bahasa Indonesia" : "in English";

    const prompt = `Kamu adalah asisten perpustakaan profesional. Buat ringkasan buku ${languageInstruction}.

INFORMASI BUKU:
${text}

INSTRUKSI:
1. Panjang: ${minLength}-${maxLength} karakter
2. Fokus: plot utama, konflik, karakter, tema
3. JANGAN ungkap spoiler atau ending
4. Tulis 2-3 paragraf mengalir
5. Mulai langsung tanpa pembukaan seperti "Buku ini bercerita..."

CONTOH FORMAT:
Sophie Amundsen adalah gadis 14 tahun yang menerima surat misterius berisi pertanyaan filosofis. Melalui korespondensi dengan filsuf Alberto Knox, ia memulai perjalanan intelektual menjelajahi sejarah pemikiran dari Yunani Kuno hingga modern.

Konflik muncul ketika Sophie menyadari realitas di sekitarnya mungkin tidak seperti yang terlihat. Ia dan Alberto menghadapi eksistensi mereka sebagai bagian dari cerita yang ditulis orang lain, mempertanyakan hakikat kebebasan dan identitas.

Sekarang buat ringkasan:`;

    const genAI = new GoogleGenerativeAI(API_KEY);

    for (const modelName of MODELS) {
      const summary = await tryGenerateWithModel(genAI, modelName, prompt);

      if (summary) {
        return NextResponse.json({
          success: true,
          summary,
          model: modelName,
          length: summary.length,
        });
      }
    }

    return NextResponse.json(
      {
        error: "Semua model gagal",
        solution: "Generate API key BARU dari https://aistudio.google.com/app/apikey dan pilih 'Create API key in NEW PROJECT'",
        triedModels: MODELS,
      },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("Error in summarize API:");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);

    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        details: "Check server logs for full error"
      },
      { status: 500 }
    );
  }
}
