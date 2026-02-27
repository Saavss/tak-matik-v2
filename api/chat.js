export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST" });
  }

  try {
    const { message } = req.body;

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

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Cevap alınamadı";

    res.status(200).json({ reply: text });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}






