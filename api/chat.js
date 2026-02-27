export default async function handler(req, res) {
  // CORS ayarları (Tarayıcı engellememesi için)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yöntem İzin Verilmedi' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API anahtarı Vercel üzerinde bulunamadı!' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Sen Takimatik uzmanısın. Türkiye altın piyasası ve düğün takıları konusunda uzman bir asistansın. Kısa ve öz cevap ver. Soru: " + message }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Sunucu tarafında bir hata oluştu: ' + error.message });
  }
}
