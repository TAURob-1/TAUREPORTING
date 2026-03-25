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
const SIGNAL_BASE_URL = process.env.SIGNAL_BASE_URL || 'http://localhost:3001';

// Users database (simple in-memory for demo)
const USERS = {
  'TAU': { password: 'Demo2026', access: 'full' },
  'Tombola': { password: 'Tombola2026', access: 'tombola-only' },
  'Cinch': { password: 'Cinch2026', access: 'cinch-only' },
  'Dayinsure': { password: 'Dayinsure2026', access: 'dayinsure-only' },
  'Day Insure': { password: 'Dayinsure2026', access: 'dayinsure-only' },
  'Midnite': { password: 'Midnite2026', access: 'midnite-only' },
};

const ACCESS_CONTEXTS = {
  'tombola-only': 'You are working with Tombola company data only. The advertiser is tombola-co-uk. All intelligence and planning should focus on Tombola.',
  'cinch-only': 'You are working with Cinch company data only. The advertiser is cinch-uk. All intelligence and planning should focus on Cinch (UK used car marketplace).',
  'dayinsure-only': 'You are working with Day Insure company data only. The advertiser is dayinsure with Signal slug dayinsure-com. All intelligence and planning should focus on Day Insure (UK temporary car insurance / digital services).',
  'midnite-only': 'You are working with Midnite company data only. The advertiser is midnite-com. Midnite is a UK-based esports and sports betting platform targeting 18-34 male audiences. All intelligence and planning should focus on Midnite. Key context: Midnite is currently ranked #5 by traffic (1.8% market share) and is executing a bold 2026-2028 growth strategy targeting Tier 1 operator status. CTV-first media allocation, "Built Different" positioning, and creator-led frequency strategy are core pillars. Competitors: Bet365, Sky Bet, Paddy Power, Betfair.',
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

async function proxySignalJson(req, res, targetPath) {
  try {
    const response = await fetch(`${SIGNAL_BASE_URL}${targetPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : await response.text();

    if (!response.ok) {
      return res.status(response.status).json(
        typeof body === 'string' ? { error: body || 'Signal request failed' } : body
      );
    }

    if (contentType.includes('application/json')) {
      return res.json(body);
    }

    return res.status(response.status).send(body);
  } catch (error) {
    console.error('[Signal Proxy] JSON proxy failed:', error);
    return res.status(502).json({ error: 'Signal proxy unavailable', details: error.message });
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

app.post('/api/widget', requireAuth, async (req, res) => {
  return proxySignalJson(req, res, '/api/widget');
});

app.get('/api/widget/demo', requireAuth, async (req, res) => {
  try {
    const response = await fetch(`${SIGNAL_BASE_URL}/api/widget/demo`);
    const payload = await response.json().catch(() => ({}));
    return res.status(response.status).json(payload);
  } catch (error) {
    console.error('[Signal Proxy] Widget demo proxy failed:', error);
    return res.status(502).json({ error: 'Signal proxy unavailable', details: error.message });
  }
});

app.post('/api/ppt/preview', requireAuth, async (req, res) => {
  return proxySignalJson(req, res, '/api/ppt/preview');
});

app.post('/api/ppt/generate', requireAuth, async (req, res) => {
  try {
    const response = await fetch(`${SIGNAL_BASE_URL}/api/ppt/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json().catch(() => ({}))
        : { error: await response.text().catch(() => 'PPT generation failed') };
      return res.status(response.status).json(payload);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentDisposition = response.headers.get('content-disposition') || 'attachment; filename=presentation.pptx';
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
    res.setHeader('Content-Disposition', contentDisposition);
    return res.send(buffer);
  } catch (error) {
    console.error('[Signal Proxy] PPT proxy failed:', error);
    return res.status(502).json({ error: 'Signal proxy unavailable', details: error.message });
  }
});

app.post('/api/voice', requireAuth, async (req, res) => {
  try {
    const headers = {};
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }

    const response = await fetch(`${SIGNAL_BASE_URL}/api/voice`, {
      method: 'POST',
      headers,
      body: req,
      duplex: 'half',
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : { error: await response.text().catch(() => 'Voice request failed') };

    return res.status(response.status).json(payload);
  } catch (error) {
    console.error('[Signal Proxy] Voice proxy failed:', error);
    return res.status(502).json({ error: 'Signal proxy unavailable', details: error.message });
  }
});

// Generate keyword clusters via Claude API
app.post('/api/generate-keywords', requireAuth, async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { selectedAttributes } = req.body;
  if (!Array.isArray(selectedAttributes) || selectedAttributes.length === 0) {
    return res.status(400).json({ error: 'selectedAttributes array required' });
  }

  const attrDescriptions = selectedAttributes
    .map((a) => `${a.classKey}.${a.attrKey}${a.label ? ` (${a.label})` : ''}`)
    .join(', ');

  // Build platform context hints for richer keyword generation
  const platformHints = selectedAttributes.map((a) => {
    const classKey = a.classKey;
    const hints = [];
    if (['DEMO', 'GEO'].includes(classKey)) hints.push('easily targetable on Google, Meta, and TikTok via native demographic/geo controls');
    if (classKey === 'SOCIO') hints.push('Google has household income tiers; LinkedIn targets via job seniority; Amazon infers from purchase data');
    if (classKey === 'BEHAV') hints.push('Google In-Market & Affinity audiences, Meta Detailed Targeting, Amazon purchase-based audiences, TikTok interest categories');
    if (classKey === 'PSYCH') hints.push('Google Affinity segments, Meta interest targeting, Pinterest boards as psychographic signal');
    if (classKey === 'PURCH') hints.push('Amazon has actual transaction data; Google In-Market segments track purchase research; Pinterest has high purchase intent');
    if (classKey === 'CONTEXT') hints.push('Google contextual topics/placements, Amazon seasonal categories, TikTok Pulse for trending content');
    if (classKey === 'MEDIA') hints.push('Google/YouTube channel targeting, Amazon Prime Video/Twitch/Fire TV, Meta placement controls');
    return hints.length > 0 ? `${a.classKey}.${a.attrKey}: ${hints.join('; ')}` : null;
  }).filter(Boolean).join('\n');

  const prompt = `Generate UK search keyword clusters for a media planning tool. The audience attributes are: ${attrDescriptions}.

Platform targeting context (use this to inform keyword themes — include platform-specific search terms where relevant):
${platformHints}

For example, if targeting demographics, include keywords people would use when researching ad platforms' targeting capabilities (e.g. "google ads age targeting", "meta audience segments"). If targeting purchase behaviors, include keywords reflecting how people search on Amazon, Google Shopping, etc.

Return exactly 3 keyword groups. Each group has a theme name and 4-5 keywords with realistic UK search data.

Return ONLY valid JSON in this exact format, no other text:
[
  { "group": "Theme Name", "keywords": [
    { "term": "example search term", "volume": 12100, "cpc": 1.50, "competition": 0.65 },
    { "term": "another term", "volume": 8100, "cpc": 0.90, "competition": 0.42 }
  ]},
  { "group": "Second Theme", "keywords": [
    { "term": "search term here", "volume": 9900, "cpc": 1.20, "competition": 0.55 }
  ]}
]

Rules:
- volume: realistic UK monthly search volumes (use values like 2900, 3600, 4400, 5400, 6600, 8100, 9900, 12100, 14800, 18100, 22200, 27100, 33100, 40500)
- cpc: cost per click in GBP (0.30–6.00 range)
- competition: 0–1 scale
- Terms should be UK-relevant search queries that someone matching these audience attributes would search for
- Make keyword themes specific to the attributes, not generic
- Where appropriate, include platform-specific terms (e.g. Amazon Prime deals, Google Shopping, Meta marketplace)`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Anthropic API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse keyword response' });
    }

    const clusters = JSON.parse(jsonMatch[0]);

    // Build keywordGroups in the same shape gatherKeywords() returns
    const keywordGroups = selectedAttributes.map((attr) => ({
      classKey: attr.classKey,
      attrKey: attr.attrKey,
      label: attr.label || `${attr.classKey}.${attr.attrKey}`,
      clusters,
    }));

    res.json({ keywordGroups });

  } catch (error) {
    console.error('[GenerateKeywords] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── Midnite Signal Intelligence endpoint ─────────────────────────────────────
// Returns pre-fetched Signal-v1 data for Midnite (and optionally other clients)
app.get('/api/signal-data/:client', requireAuth, async (req, res) => {
  const client = String(req.params.client || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const userAccess = req.session.user?.access;

  // Access control: restrict client data to appropriate users
  const accessMap = {
    'midnite': 'midnite-only',
    'tombola': 'tombola-only',
    'cinch': 'cinch-only',
    'dayinsure': 'dayinsure-only',
  };

  const requiredAccess = accessMap[client];
  if (requiredAccess && userAccess !== 'full' && userAccess !== requiredAccess) {
    return res.status(403).json({ error: 'Access denied for this client' });
  }

  const dataDir = path.join(__dirname, 'signal-data', client);
  try {
    const files = await fs.readdir(dataDir).catch(() => []);
    if (files.length === 0) {
      return res.status(404).json({ error: `No signal data found for client: ${client}` });
    }

    const result = { client, files: {} };
    for (const file of files.filter(f => f.endsWith('.json'))) {
      const key = file.replace('.json', '');
      result.files[key] = await tryReadJson(path.join(dataDir, file));
    }
    return res.json(result);
  } catch (error) {
    console.error('[SignalData] Error reading client data:', error);
    return res.status(500).json({ error: 'Failed to load signal data', details: error.message });
  }
});

// Shorthand: fetch latest Midnite intelligence
app.get('/api/midnite/intelligence', requireAuth, async (req, res) => {
  const userAccess = req.session.user?.access;
  if (userAccess !== 'full' && userAccess !== 'midnite-only') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [company, summary, data] = await Promise.all([
      tryReadJson(path.join(__dirname, 'signal-data/midnite/company.json')),
      tryReadJson(path.join(__dirname, 'signal-data/midnite/summary.json')),
      tryReadJson(path.join(__dirname, 'signal-data/midnite/data.json')),
    ]);

    const strategy = await fs.readFile(path.join(__dirname, 'signal-data/midnite/growth-strategy.md'), 'utf8').catch(() => null);

    return res.json({
      client: 'midnite',
      slug: 'midnite-com',
      source: 'Signal-v1',
      retrieved_at: new Date().toISOString(),
      company: company?.config || {},
      status: company?.status || {},
      summary: summary || {},
      intelligence: data || {},
      growth_strategy_available: !!strategy,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load Midnite intelligence', details: error.message });
  }
});

// ─── TAU Skills API ───────────────────────────────────────────────────────────
// All 18+ skills available as structured reference data
const TAU_SKILLS = [
  { id: 'abm-prospecting', name: 'ABM Prospecting', category: 'strategy', description: 'Account-based marketing prospecting: ICP definition, account-list building, Companies House enrichment workflows, TAU outbound methodology.' },
  { id: 'attribution-diagnostic', name: 'Attribution Diagnostic', category: 'measurement', description: 'Diagnose attribution model health, identify measurement gaps, and recommend fit-for-purpose attribution frameworks.' },
  { id: 'audience-graph', name: 'Audience Graph', category: 'audience', description: 'Build audience graphs using the Rosetta Stone P×S scoring framework across 8 targeting mechanisms and ~50 audience attributes.' },
  { id: 'blueprint-sprint', name: 'Blueprint Sprint', category: 'strategy', description: 'Rapid strategic planning sprint to produce a media and audience blueprint. Scoping, prioritisation, and commercial framing.' },
  { id: 'brand-building', name: 'Brand Building', category: 'strategy', description: 'Long-term brand growth strategy using Binet & Field econometrics, share of voice principles, and emotional vs rational channel mix.' },
  { id: 'channel-approach', name: 'Channel Approach', category: 'planning', description: 'Channel selection and weighting framework. Maps audience attributes to best-fit media channels with rationale and budget guidance.' },
  { id: 'commercial-proposal', name: 'Commercial Proposal', category: 'commercial', description: 'Structure and write client-facing commercial proposals. Includes pricing logic, scope definition, and value articulation.' },
  { id: 'context-engineering', name: 'Context Engineering', category: 'ai', description: 'Design AI agent prompts and context structures. Covers system prompt architecture, multi-agent coordination, and context windows.' },
  { id: 'ctv-av', name: 'CTV / AV', category: 'channel', description: 'Connected TV and audio-visual planning: reach curves, frequency caps, CPM benchmarks, CTV vs linear trade-offs, and measurement.' },
  { id: 'display', name: 'Display', category: 'channel', description: 'Programmatic and direct display advertising: formats, targeting, viewability, brand safety, and performance benchmarks.' },
  { id: 'email', name: 'Email', category: 'channel', description: 'Email marketing strategy: segmentation, lifecycle programmes, deliverability, creative best practices, and measurement.' },
  { id: 'media-planning', name: 'Media Planning', category: 'planning', description: 'Full-funnel media planning: budget allocation, channel mix, reach & frequency objectives, flighting, and optimisation loops.' },
  { id: 'meta-social', name: 'Meta / Social', category: 'channel', description: 'Meta (Facebook/Instagram) and broader social media advertising: audience targeting, creative formats, campaign structure, and bidding.' },
  { id: 'paid-search', name: 'Paid Search', category: 'channel', description: 'Google and Bing paid search: keyword strategy, match types, Quality Score, smart bidding, and search vs shopping trade-offs.' },
  { id: 'programmatic', name: 'Programmatic', category: 'channel', description: 'Programmatic buying: DSP strategy, inventory quality, PMPs vs open auction, data activation, and bid landscape analysis.' },
  { id: 'psychological', name: 'Psychological', category: 'audience', description: 'Psychographic audience modelling: values-based segmentation, emotional triggers, and psychological targeting frameworks.' },
  { id: 'rosetta-stone', name: 'Rosetta Stone', category: 'audience', description: "TAU's proprietary audience translation framework. Maps any audience to 8 targeting mechanisms (KEY, GEO, CRM, CTX, LAL, CHAN, INT, TIME) with P×S scoring." },
  { id: 'search', name: 'Search (Organic)', category: 'channel', description: 'SEO strategy: keyword research, technical SEO, content planning, SERP analysis, and search visibility measurement.' },
  { id: 'social', name: 'Social (Organic)', category: 'channel', description: 'Organic social media strategy: content planning, community management, influencer selection, and social listening.' },
  { id: 'tau-os', name: 'TAU OS', category: 'framework', description: "TAU's operating system for AI-powered marketing consultancy. Covers agent orchestration, client delivery frameworks, and methodology principles." },
  { id: 'tv-av', name: 'TV / AV (Linear)', category: 'channel', description: 'Linear TV and video advertising: BARB audiences, buying mechanics, sponsorship, and TV-digital attribution.' },
  { id: 'youtube', name: 'YouTube', category: 'channel', description: 'YouTube advertising: formats (skippable, bumper, masthead), audience targeting, content adjacency, and performance measurement.' },
];

// List all skills
app.get('/api/skills', requireAuth, (req, res) => {
  const { category } = req.query;
  const skills = category
    ? TAU_SKILLS.filter(s => s.category === category)
    : TAU_SKILLS;
  res.json({ skills, total: skills.length });
});

// Get skill categories
app.get('/api/skills/categories', requireAuth, (req, res) => {
  const categories = [...new Set(TAU_SKILLS.map(s => s.category))].sort();
  res.json({ categories });
});

// Get specific skill metadata + content
app.get('/api/skills/:skillId', requireAuth, async (req, res) => {
  const skillId = String(req.params.skillId || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const skill = TAU_SKILLS.find(s => s.id === skillId);

  if (!skill) {
    return res.status(404).json({ error: `Skill not found: ${skillId}` });
  }

  // Try to load SKILL.md content from TAU_Skills directory
  const skillPaths = [
    `/home/r2/TAU_Skills/skills/${skillId}/SKILL.md`,
    `/home/r2/TAU_Skills/skills/${skillId === 'context-engineering' ? 'context_engineering.md' : skillId}/SKILL.md`,
    `/home/r2/TAU_Skills/skills/context_engineering.md`, // special case
  ];

  let content = null;
  for (const p of skillPaths) {
    try {
      content = await fs.readFile(p, 'utf8');
      break;
    } catch { /* try next */ }
  }

  // For the context_engineering.md special case (flat file, not directory)
  if (!content && skillId === 'context-engineering') {
    content = await fs.readFile('/home/r2/TAU_Skills/skills/context_engineering.md', 'utf8').catch(() => null);
  }

  res.json({
    ...skill,
    content: content || null,
    content_available: !!content,
  });
});

// ─── Serve static files from dist directory (AFTER all API routes) ─────────────
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
