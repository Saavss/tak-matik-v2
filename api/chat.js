export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST" });
  }

  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const message = body?.message || "Merhaba";

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key yok" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: message }] }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("GEMINI:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI boş cevap verdi";

    res.status(200).json({ reply });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ error: e.message });
  }
}
