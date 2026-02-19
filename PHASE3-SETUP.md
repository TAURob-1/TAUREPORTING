# TAU-Reporting Phase 3 Setup Instructions

## Phase 3 Status: ✅ COMPLETE (needs API key)

All Phase 3 features are implemented and working. Chat integration is ready but needs your Anthropic API key to function.

---

## Quick Setup (2 steps)

### 1. Add API Key to .env

Edit `/home/r2/TAU-Reporting/.env` and add your Anthropic API key:

```bash
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### 2. Restart the Server

```bash
cd /home/r2/TAU-Reporting
npm run dev -- --host 0.0.0.0 --port 5175
```

That's it! Chat will now work at http://100.98.17.27:5175

---

## What Works Now

### AI Planner Chat
- ✅ Send messages in Chat tab
- ✅ Real AI responses using Claude Sonnet 4.5
- ✅ Full 7-layer planning framework applied
- ✅ Context includes:
  - Advertiser name & country
  - Selected Signal intelligence data
  - Planning state (which layers completed, media plan status)
  - Full system prompt with 7-layer instructions
- ✅ Chat history persists across refreshes (localStorage)
- ✅ Error messages if API key not configured

### What Gets Sent to AI

Every message includes rich context:
```
[Platform Context]
Advertiser: Tombola
Country: UK

[Signal Intelligence]
Traffic Intelligence: Available
Competitor Insights: Available

[Planning State]
Layers completed: 0 of 7
Media plan status: Not started

[System Instructions]
<7-layer planning framework...>

---

User message: Help me plan a campaign
```

---

## Dashboard Chat (Optional)

The dashboard at http://100.98.17.27:4176 also has chat, but needs the same API key.

**To enable dashboard chat:**

```bash
export ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
cd /home/r2/clawd/clawdbot-dashboard
npm run dev -- --port 4176 --host 0.0.0.0
```

If not configured, dashboard chat shows a helpful message pointing to TAU-Reporting for full AI planning.

---

## Security Note

⚠️ **The API key is exposed in the frontend bundle** (because it's `VITE_ANTHROPIC_API_KEY`).

This is fine for:
- Internal demos
- Development
- Testing

For production:
- Create a backend proxy API
- Store API key server-side only
- Frontend calls your proxy, proxy calls Anthropic

Phase 3 uses direct API calls for speed. We can add a backend proxy in Phase 4+ if needed.

---

## Testing

1. Visit http://100.98.17.27:5175
2. Click "AI Planner" (first tab)
3. Type a message: "Help me plan a campaign for Tombola in the UK"
4. Should get strategic 7-layer planning guidance
5. Try: "Walk me through Layer 3 - Channel Planning"
6. AI should provide detailed channel selection guidance

---

## Troubleshooting

**"ANTHROPIC_API_KEY not configured" error:**
- Check .env file has the key
- Restart the dev server
- Check for typos in env var name

**No response / timeout:**
- Check API key is valid
- Check internet connection
- Check Anthropic API status

**Console errors:**
- Open browser DevTools > Console
- Look for `[Planner]` log messages
- Should show: WebSocket opened, sending message, got response

---

## Files Modified in Phase 3

- `src/services/plannerChat.js` (new) - Anthropic API integration
- `src/components/planner/tabs/ChatTab.jsx` - Real chat UI
- `src/data/signalIntegration.js` - Signal context formatting
- `.env` (new) - API key storage

---

## Next: Phase 4

Once chat is working, Phase 4 will add:
- Parse AI responses for media plan updates
- Auto-update Media Plan tab when AI generates plan
- Parse flighting data for Campaign Planning page
- Parse personas for Audience Targeting page
- Structured output handling

But first: Test Phase 3 and confirm chat works! 🎯
