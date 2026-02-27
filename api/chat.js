export default async function handler(req, res) {
  // CORS ve Başlık Ayarları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' });

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Anahtarı Eksik!' });
  }

  try {
    // Gemini API'ye istek (Global fetch kullanımı)
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Sen Takimatik.com.tr uzmanısın. Kısa ve yardımcı bir dille cevap ver: " + message }] }]
      })
    });

    const data = await apiResponse.json();
    
    // Eğer Google hata döndürürse bunu görelim
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
}
