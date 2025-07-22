require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// ✅ Grab OpenAI key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("🔑 OPENAI_API_KEY in backend is:", OPENAI_API_KEY);

// ✅ Enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// 🧠 Chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ error: 'AI request failed. Check API key or rate limit.' });
  }
});

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname)));

// ✅ Dynamic port support for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Medverse AI is running on port ${PORT}`);
});
