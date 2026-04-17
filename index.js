const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.status(400).send('No message');
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: msg }] }]
        })
      }
    );
    const d = await r.json();
    res.send(d.candidates[0].content.parts[0].text);
  } catch(e) {
    res.status(500).send('Error: ' + e.message);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("LP10 AI running!"));
