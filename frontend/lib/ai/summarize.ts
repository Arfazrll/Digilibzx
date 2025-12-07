interface SummarizeOptions {
  minLength?: number;
  maxLength?: number;
  language?: "id" | "en";
}

async function summarize(
  text: string,
  options: SummarizeOptions = {}
): Promise<string> {
  const { minLength = 200, maxLength = 500, language = "id" } = options;

  if (!text || text.trim().length === 0) {
    return "Error: Tidak ada teks untuk diringkas.";
  }

  try {
    console.log("Memanggil API summarize...");

    const response = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        minLength,
        maxLength,
        language,
      }),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Gagal parse JSON dari API:", e);
      return "Error: Response server tidak berbentuk JSON.";
    }

    if (!response.ok) {
      console.error("API error:", data);
      return `Error: ${data?.error || "Gagal generate ringkasan"}${
        data?.solution ? `\n\n${data.solution}` : ""
      }`;
    }

    if (data.success && data.summary) {
      console.log(
        `Ringkasan berhasil! Model: ${data.model}, Panjang: ${data.length} karakter`
      );
      return data.summary;
    }

    console.error("Response tidak valid:", data);
    return "Error: Response tidak valid dari server.";
  } catch (error: any) {
    console.error("Error saat fetch API:", error);

    if (error?.message?.includes("fetch failed")) {
      return "Error: Koneksi ke server gagal. Pastikan server Next.js berjalan.";
    }

    return `Error: ${error?.message || "Unknown error"}`;
  }
}

export async function testGeminiConnection(): Promise<boolean> {
  try {
    console.log("Testing API summarize...");

    const response = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Test book: A story about testing",
        minLength: 50,
        maxLength: 100,
        language: "en",
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log("API test berhasil!");
      return true;
    } else {
      console.log("API test gagal:", data);
      return false;
    }
  } catch (error: any) {
    console.error("Test gagal:", error?.message || error);
    return false;
  }
}

export default summarize;