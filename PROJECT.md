# Project: TAU-Reporting
_Last updated: 2026-04-25 00:20 UK_
_Repo: github.com/TAURob-1/TAUREPORTING_

## Status
Multi-tenant reporting platform live. Tombola, Midnite, Cinch, Dayinsure tenants working. Skills API operational. PPT generation functional.

## Next Action
**Integrate Zepz/forecaster data into the reporting layer.**
- Owner: Codex + Ethan
- Path: `/home/r2/TAU-Reporting`
- Done when: Zepz tenant shows real data from Forecaster output; not mock/placeholder

## Blockers
- Awaiting Ethan Buckley data requirements from Forecaster project

## Done (recent)
- [2026-04-19] Multi-tenant auth implemented (Tombola, Midnite, Cinch, Dayinsure)
- [2026-04-19] Signal integration added
- [2026-04-19] Skills panel live
- [2026-04-19] PPT generator updated

## Notes
- Running locally on port 5176 (`npm run dev`)
- Deploy target: Vercel or Railway (not yet deployed)
- Skills API reads from TAU skills directory
- Multi-tenant config: each tenant has isolated data + branding
