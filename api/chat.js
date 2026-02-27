export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği kabul edilir' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        // Vercel'in en güncel Node.js sürümlerinde fetch hazırdır. 
        // Eğer hata veriyorsa hata mesajını net bir şekilde döndürelim.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Sen Takimatik.com.tr uzmanısın. Kısa cevap ver. Soru: " + message }] }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || "Google API Hatası" });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Sunucu hatası: " + err.message });
    }
}
