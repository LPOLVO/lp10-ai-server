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

app.post('/log', async (req, res) => {
  try {
    const { username, userId, game, jobId, scriptName, placeId } = req.body;
    const WEBHOOK = process.env.DISCORD_WEBHOOK;

    const profileLink = userId
      ? "[" + username + "](https://www.roblox.com/users/" + userId + "/profile)"
      : username || "Unknown";

    const gameLink = placeId
      ? "[" + (game || "Unknown") + "](https://www.roblox.com/games/" + placeId + ")"
      : (game || "Unknown");

    const joinLink = placeId && jobId
      ? "[🎮 Join Server](https://www.roblox.com/games/" + placeId + "?gameInstanceId=" + jobId + ")"
      : null;

    const fields = [
      { name: "👤 Username", value: profileLink, inline: true },
      { name: "🎮 Game", value: gameLink, inline: true },
      { name: "📜 Script", value: scriptName || "Just opened hub", inline: false },
      { name: "🔗 Job ID", value: "```" + (jobId || "Unknown") + "```", inline: false },
    ];

    if (joinLink) {
      fields.push({ name: "🚀 Join", value: joinLink, inline: false });
    }

    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: scriptName && scriptName !== "Just opened hub"
            ? "▶️ LP10 HUB — Script Executed"
            : "👁 LP10 HUB — New User",
          color: scriptName && scriptName !== "Just opened hub" ? 0x00FF88 : 0x2196F3,
          fields: fields,
          footer: { text: "LP10 HUB by @LPOLVO" },
          timestamp: new Date().toISOString()
        }]
      })
    });
    res.send("ok");
  } catch(e) {
    res.status(500).send("error");
  }
});

app.listen(process.env.PORT || 3000, () => console.log("LP10 AI running!"));
