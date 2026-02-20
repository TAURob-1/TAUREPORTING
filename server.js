// TAU-Reporting API Proxy Server
// Handles Anthropic API calls from frontend (CORS workaround)

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = process.env.API_PORT || 5176;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json());

const MEDIA_ROOT = '/home/r2/Signal/Media';

async function tryReadJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

app.get('/api/media/:resource', async (req, res) => {
  const resource = String(req.params.resource || '').toLowerCase();
  if (!['channels', 'ctv', 'radio'].includes(resource)) {
    return res.status(400).json({ error: 'Unsupported media resource' });
  }

  const direct = await tryReadJson(path.join(MEDIA_ROOT, `${resource}.json`));
  if (direct) return res.json(Array.isArray(direct) ? direct : (direct.items || []));

  const ukMedia = await tryReadJson(path.join(MEDIA_ROOT, 'uk-media', `${resource}.json`));
  if (ukMedia) return res.json(Array.isArray(ukMedia) ? ukMedia : (ukMedia.items || []));

  return res.json([]);
});

// Proxy endpoint for Anthropic API
app.post('/api/chat', async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Anthropic API error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('[Proxy] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TAU-Reporting API proxy running on port ${PORT}`);
  console.log(`   API key configured: ${ANTHROPIC_API_KEY ? 'YES' : 'NO'}`);
});
