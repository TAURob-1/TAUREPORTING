// TAU-Reporting API Proxy Server with Authentication
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const app = express();
const PORT = process.env.PORT || 5176;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
const SESSION_SECRET = process.env.SESSION_SECRET || 'tau-reporting-secret-change-in-production';

// Users database (simple in-memory for demo)
const USERS = {
  'TAU': { password: 'Demo2026', access: 'full' },
  'Tombola': { password: 'Tombola2026', access: 'tombola-only' },
  'Cinch': { password: 'Cinch2026', access: 'cinch-only' }
};

const ACCESS_CONTEXTS = {
  'tombola-only': 'You are working with Tombola company data only. The advertiser is tombola-co-uk. All intelligence and planning should focus on Tombola.',
  'cinch-only': 'You are working with Cinch company data only. The advertiser is cinch-uk. All intelligence and planning should focus on Cinch (UK used car marketplace).',
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Railway handles SSL termination
    httpOnly: true,
    sameSite: 'lax',
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
    const requestBody = { ...req.body };
    const accessContext = ACCESS_CONTEXTS[userAccess];

    if (accessContext) {
      if (requestBody.system) {
        requestBody.system = requestBody.system + '\n\n' + accessContext;
      } else {
        requestBody.system = accessContext;
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

// Serve static files from dist directory (AFTER all API routes)
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const distPath = path.join(__dirname, 'dist');

if (existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback - serve index.html for any unmatched routes
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('Static files served from dist/');
} else {
  console.log('No dist/ folder found — run npm run build or use vite dev server');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TAU-Reporting API proxy running on port ${PORT}`);
  console.log(`   API key configured: ${ANTHROPIC_API_KEY ? 'YES' : 'NO'}`);
  console.log(`   Auth enabled: ${Object.keys(USERS).length} users`);
});
