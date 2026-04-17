const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.status(400).send('No message');
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: msg }],
      max_tokens: 300
    })
  });
  const d = await r.json();
  res.send(d.choices[0].message.content);
});

app.listen(process.env.PORT || 3000, () => console.log("running!"));
