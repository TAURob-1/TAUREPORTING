# TAU Reporting Platform

Campaign intelligence and planning platform with Signal integration and AI-powered insights.

## Features

- **AI Campaign Planner** - Claude-powered strategic planning
- **Signal Intelligence** - Competitive intel from TAU Signal platform  
- **Audience Targeting** - UK MSOA demographic enrichment + audience sizing
- **Media Reach** - UK + US media platform coverage analysis
- **User Authentication** - Role-based access control

## Authentication

Two user tiers:

### Full Access
- **Username:** `TAU`
- **Password:** `Demo2026`
- Access to all companies and features

### Limited Access (Tombola)
- **Username:** `Tombola`
- **Password:** `Tombola2026`
- Limited to Tombola company data only

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (frontend)
npm run dev

# Start API server (backend)
npm run server
```

Frontend: `http://localhost:5173`  
API: `http://localhost:5176`

### Railway Production

Required environment variables:

```
ANTHROPIC_API_KEY=sk-ant-...
SESSION_SECRET=<random-string>
NODE_ENV=production
API_PORT=5176
```

Build command: `npm run build`  
Start command: `node server.js`

## Data Sources

- **UK MSOA Demographics**: `public/data/uk/raw/uk_demographics_enriched_msoa.csv` (4.7MB)
- **UK Media Platforms**: `public/data/uk/uk-media-platforms.json` (BARB data)
- **Signal Intelligence**: Loaded from `/home/r2/Signal/companies/` (local only)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express + Anthropic API
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Auth**: Express-session

## GitHub

Repository: https://github.com/TAURob-1/TAUREPORTING

## License

Proprietary - TAU (The Independent Marketing Intelligence Architect)
