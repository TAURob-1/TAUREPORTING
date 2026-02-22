// TAU-Reporting API Proxy Server with Authentication
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 5176;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
const SESSION_SECRET = process.env.SESSION_SECRET || 'tau-reporting-secret-change-in-production';

// Users database (simple in-memory for demo)
const USERS = {
  'TAU': { password: 'Demo2026', access: 'full' },
  'Tombola': { password: 'Tombola2026', access: 'tombola-only' }
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = USERS[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.user = {
    username,
    access: user.access
  };

  res.json({ 
    success: true, 
    user: { username, access: user.access }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Current user endpoint
app.get('/api/user', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

const MEDIA_ROOT = '/home/r2/Signal/Media';

async function tryReadJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

app.get('/api/media/:resource', requireAuth, async (req, res) => {
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

// Proxy endpoint for Anthropic API with user filtering
app.post('/api/chat', requireAuth, async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    // Apply user-based data filtering
    const userAccess = req.session.user.access;
    let requestBody = req.body;

    // For Tombola user, ensure only tombola-co-uk data is accessible
    if (userAccess === 'tombola-only') {
      // Inject system context about data restrictions
      const systemMessage = {
        role: 'system',
        content: 'You are working with Tombola company data only. The advertiser is tombola-co-uk. All intelligence and planning should focus on Tombola.'
      };

      if (Array.isArray(requestBody.messages)) {
        requestBody.messages = [systemMessage, ...requestBody.messages];
      }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
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
  console.log(`   Auth enabled: ${Object.keys(USERS).length} users`);
});
