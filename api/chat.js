export default async function handler(req, res) {
  // CORS ve Başlık Ayarları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' });

  // req.body'yi güvenli bir şekilde alalım
  let message;
  try {
    // Eğer req.body bir string ise JSON'a çevir, değilse direkt kullan
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    message = body.message;
  } catch (e) {
    return res.status(400).json({ error: "Mesaj okunamadı. JSON formatı hatası." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API anahtarı bulunamadı!' });
  }

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Sen Takimatik.com.tr uzmanısın. Kısa cevap ver: " + message }] }]
      })
    });

    const data = await apiResponse.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
}
