export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userMessage = body.message;
        const apiKey = process.env.GEMINI_API_KEY;

        // DİKKAT: Burası en garanti URL formatıdır (v1beta kullanıyoruz)
       const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Sen Takimatik uzmanısın. Kısa cevap ver: " + userMessage }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Hata gelirse detayıyla fırlat ki F12'de görelim
            return res.status(response.status).json({ error: data.error });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Sunucu hatası: " + err.message });
    }
}





