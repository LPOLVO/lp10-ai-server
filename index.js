const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.status(400).send('No message');
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful assistant. Always reply in the same language the user writes in." },
          { role: "user", content: msg }
        ],
        max_tokens: 300
      })
    });
    const d = await r.json();
    res.send(d.choices[0].message.content);
  } catch(e) {
    res.status(500).send('Error: ' + e.message);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("LP10 AI running!"));
