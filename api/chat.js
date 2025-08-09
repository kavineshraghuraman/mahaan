export default async function handler(req, res) {
  const { message } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing.");
    return res.status(500).json({ reply: "⚠️ பிழை: API key இல்லை." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
நீங்கள் ஒரு தமிழ் விவசாய உதவியாளர்.
பதில்களை எப்போதும் **Markdown** வடிவில் எழுதவும்:
- முக்கிய புள்ளிகளை bullet points ஆக எழுதவும்
- முக்கிய வார்த்தைகளை **போல்ட்** ஆக்கவும்
- தேவைப்பட்டால் Markdown அட்டவணைகளை பயன்படுத்தவும்
பயனர்: ${message}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("📡 Gemini API raw response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ reply: "⚠️ AI சேவையுடன் இணைக்க முடியவில்லை." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "பதில் வரவில்லை.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ reply: "⚠️ சர்வர் பிழை." });
  }
}
