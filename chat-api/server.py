"""
TAU Reporting Strategic Advisor — Chat API
Powered by Claude Haiku with real TAU Signal intelligence data.

Run: uvicorn server:app --port 3002 --reload
"""

import os
import json
import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env from Signal directory (has API keys)
load_dotenv(os.path.expanduser("~/Signal/.env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===================
# Configuration
# ===================

DEFAULT_COMPANY = os.getenv("DEFAULT_COMPANY", "demo-advertiser")
DISPLAY_COMPANY = os.getenv("DISPLAY_COMPANY", "Demo Advertiser")
ADVISOR_TITLE = os.getenv("ADVISOR_TITLE", "TAU Reporting Strategic Advisor")

SIGNAL_DATA_DIR = Path(os.getenv(
    "SIGNAL_DATA_DIR",
    os.path.expanduser(f"~/Signal/companies/{DEFAULT_COMPANY}")
))

# Provider selection: anthropic or openai
PROVIDER = os.getenv("CHAT_PROVIDER", "auto")  # auto, anthropic, openai
MAX_TOKENS = 2048
MAX_HISTORY = 20  # Keep last N messages for context

# Auto-detect best available provider
def get_provider():
    if PROVIDER == "anthropic" or (PROVIDER == "auto" and os.getenv("ANTHROPIC_API_KEY")):
        return "anthropic"
    elif os.getenv("OPENAI_API_KEY"):
        return "openai"
    else:
        raise RuntimeError("No API key found. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.")

ACTIVE_PROVIDER = get_provider()

if ACTIVE_PROVIDER == "anthropic":
    import anthropic
    client = anthropic.Anthropic()
    MODEL = os.getenv("CHAT_MODEL", "claude-haiku-4-5-20251001")
else:
    import openai
    client = openai.OpenAI()
    MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")

logger.info(f"Chat provider: {ACTIVE_PROVIDER}, model: {MODEL}")

# ===================
# Load Signal Intelligence
# ===================

def load_signal_context() -> str:
    """Load and curate Signal data into a strategic context document."""
    summary_dir = SIGNAL_DATA_DIR / "summary"
    data_dir = SIGNAL_DATA_DIR / "data"

    context_parts = []

    # --- Strategic Brief (human-readable executive summary) ---
    brief_path = summary_dir / "strategic_brief.md"
    if brief_path.exists():
        context_parts.append(f"## EXECUTIVE STRATEGIC BRIEF\n{brief_path.read_text()[:8000]}")

    # --- Insights & Actions (recommendations, SWOT, rankings) ---
    insights_path = summary_dir / "insights_and_actions.json"
    if insights_path.exists():
        data = json.loads(insights_path.read_text())
        context_parts.append(f"## STRATEGIC INSIGHTS & ACTIONS\n{json.dumps(data, indent=2)[:12000]}")

    # --- Traffic Intelligence (market share, competitors, trends) ---
    traffic_path = summary_dir / "traffic_intelligence.json"
    if traffic_path.exists():
        data = json.loads(traffic_path.read_text())
        context_parts.append(f"## TRAFFIC INTELLIGENCE\n{json.dumps(data, indent=2)[:8000]}")

    # --- Customer Intelligence (reviews, sentiment, pain points) ---
    customer_path = summary_dir / "customer_intelligence.json"
    if customer_path.exists():
        data = json.loads(customer_path.read_text())
        context_parts.append(f"## CUSTOMER INTELLIGENCE\n{json.dumps(data, indent=2)[:5000]}")

    # --- AI Visibility (AI readiness, search visibility) ---
    ai_path = summary_dir / "ai_visibility.json"
    if ai_path.exists():
        data = json.loads(ai_path.read_text())
        context_parts.append(f"## AI VISIBILITY SCORES\n{json.dumps(data, indent=2)[:6000]}")

    # --- Trends Intelligence (search trends, seasonality) ---
    trends_path = summary_dir / "trends_intelligence.json"
    if trends_path.exists():
        data = json.loads(trends_path.read_text())
        context_parts.append(f"## TRENDS INTELLIGENCE\n{json.dumps(data, indent=2)[:3000]}")

    # --- Outcomes Analysis (revenue, growth trajectory) ---
    outcomes_path = summary_dir / "outcomes_analysis.json"
    if outcomes_path.exists():
        data = json.loads(outcomes_path.read_text())
        context_parts.append(f"## OUTCOMES & REVENUE ANALYSIS\n{json.dumps(data, indent=2)[:3000]}")

    # --- Company Intelligence (selective — skip massive full dump) ---
    company_path = summary_dir / "company_intelligence.json"
    if company_path.exists():
        data = json.loads(company_path.read_text())
        # Extract just the key sections
        selective = {}
        for key in ['main_company_intelligence', 'competitor_intelligence_summary']:
            if key in data:
                val = data[key]
                # Truncate nested data
                selective[key] = json.dumps(val)[:6000]
        context_parts.append(f"## COMPANY INTELLIGENCE (SELECTIVE)\n{json.dumps(selective, indent=2)[:10000]}")

    # --- SEO Intelligence (selective — top keywords, gaps) ---
    seo_path = summary_dir / "seo_intelligence.json"
    if seo_path.exists():
        data = json.loads(seo_path.read_text())
        selective = {}
        for key in ['summary', 'brand_keywords', 'generic_keywords', 'recommendations']:
            if key in data:
                selective[key] = data[key]
        context_parts.append(f"## SEO INTELLIGENCE (KEY METRICS)\n{json.dumps(selective, indent=2)[:8000]}")

    # --- Spend Estimation ---
    spend_path = data_dir / "spend" / "spend_estimation.json"
    if spend_path.exists():
        data = json.loads(spend_path.read_text())
        context_parts.append(f"## SPEND ESTIMATION\n{json.dumps(data, indent=2)[:4000]}")

    # --- Ads Intelligence ---
    ads_path = data_dir / "ads" / "ads_main.json"
    if ads_path.exists():
        data = json.loads(ads_path.read_text())
        context_parts.append(f"## ADVERTISING INTELLIGENCE\n{json.dumps(data, indent=2)[:5000]}")

    # --- Demographics ---
    demo_path = data_dir / "demographics" / "demographics_main.json"
    if demo_path.exists():
        data = json.loads(demo_path.read_text())
        context_parts.append(f"## DEMOGRAPHIC PROFILE\n{json.dumps(data, indent=2)[:5000]}")

    return "\n\n".join(context_parts)


# ===================
# CTV/TV Knowledge Base
# ===================

CTV_KNOWLEDGE = """
## CTV & TV PLATFORM INTELLIGENCE

### CTV Providers (with typical CPMs and audience profiles)
| Provider | CPM Range | Audience Skew | Best For |
|----------|-----------|---------------|----------|
| Roku | $18-25 | Mass market, 35-65, cord-cutters | Broad reach, value seekers |
| YouTube CTV | $20-30 | 18-54, diverse, content-seekers | Younger demos, intent-driven |
| Hulu | $25-35 | 25-54, affluent, entertainment-focused | Premium audience, brand safety |
| Amazon Fire TV | $22-30 | Prime members, purchase-intent | High purchase intent, data targeting |
| Peacock | $20-28 | 30-60, sports/news, NBC loyalists | Sports adjacency, news audience |
| Disney+ | $30-40 | Families, 25-45, premium | Family audience, brand safe |
| Tubi | $15-20 | Budget-conscious, 25-50 | Value CPMs, reach extension |
| Paramount+ | $25-35 | 30-55, sports/entertainment | CBS audience, sports |
| Samsung TV+ | $16-22 | Samsung owners, tech-forward | FAST channel, efficient reach |
| Netflix | $35-45 | 18-49, affluent, premium | Premium demo, emerging inventory |
| Max (HBO) | $30-42 | 25-54, educated, affluent | Premium positioning, upscale demos |
| Pluto TV | $12-18 | 30-55, cord-nevers | Cheapest reach, frequency builder |

### Traditional TV Benchmarks (for comparison)
| Type | CPM Range | Notes |
|------|-----------|-------|
| Broadcast Prime | $30-50 | Declining reach, still mass |
| Cable News | $15-25 | Older demo skew (55+) |
| Cable Sports | $25-40 | High engagement, live events |
| Daytime TV | $8-15 | Cheapest linear, 55+ heavy |

### CTV Strategic Frameworks
1. **Reach-First:** Start with Roku + Tubi + Samsung TV+ for max unduplicated reach at low CPMs
2. **Premium-First:** Disney+ + Hulu + Netflix for brand safety and affluent audiences
3. **Intent-Driven:** Amazon Fire TV + YouTube CTV for purchase-intent signals
4. **Balanced:** 60% reach (Roku/Tubi/Samsung) + 30% premium (Hulu/Disney+) + 10% intent (Amazon)

### Key CTV Metrics
- **iROAS (incremental ROAS):** Gold standard for CTV measurement. >$2.00 is good, >$3.00 is excellent.
- **Incremental Lift:** Measured via geo holdout tests (DMAs). +10-20% is typical for well-targeted CTV.
- **Frequency Cap:** 3-5x/week per household optimal for CTV. Over-frequency kills performance.
- **Reach Curves:** Diminishing returns after ~60% of budget allocated to single provider. Diversify.

### Audience Targeting on CTV
- **First-Party Data:** Best signal. Upload CRM/purchase data for matching.
- **ACR (Automatic Content Recognition):** Samsung, Vizio, LG — see what people actually watch.
- **Contextual:** Content-aligned targeting (auto shows, finance content, sports).
- **Demographic + Behavioral:** Standard but less precise than digital.

### Geo Holdout Testing (Incrementality)
- Split DMAs into test (ads on) and control (ads off)
- Minimum 4-week test, 8 weeks preferred
- Need matched-pair markets (similar demographics, baseline performance)
- Statistical significance requires sufficient volume per DMA
"""


# ===================
# System Prompt
# ===================

SYSTEM_PROMPT = f"""You are the {DISPLAY_COMPANY} CTV Strategic Advisor — an AI analyst embedded in the TAU Reporting Platform built by TAU Signal.

## Your Role
You are advising {DISPLAY_COMPANY}'s marketing leadership (CTO/CMO level) on their Connected TV and television advertising strategy. You have access to comprehensive real-time intelligence data about the advertiser, their competitors, and the market.

## Your Expertise
- **CTV & TV Planning:** Deep knowledge of every major CTV platform, their audiences, CPMs, and optimal use cases
- **Audience Strategy:** Can build and recommend detailed audience personas based on real data
- **Competitive Intelligence:** Understand advertiser market position relative to key competitors
- **Measurement:** Expert in incrementality testing, geo holdouts, iROAS methodology
- **Media Mix:** Can recommend optimal budget allocation across CTV providers

## Communication Style
- **Strategic, not tactical** — think like a CTO's trusted advisor
- **Data-driven** — always reference specific numbers from the intelligence data
- **Actionable** — every insight should lead to a clear recommendation
- **Concise** — executives don't want essays. Use bullet points, tables, and clear structure.
- **Honest** — flag risks and weaknesses, don't just praise

## Persona & Audience Building
When asked about audiences or personas:
- Build personas from the demographic, traffic, and customer intelligence data
- Include: age range, HH income, vehicle profile, media consumption, CTV platform affinity
- Map personas to specific CTV providers with rationale
- Use customer review sentiment to identify pain points and messaging angles

## CTV Recommendations
When recommending CTV strategy:
- Always explain WHY a provider suits this audience (not just list them)
- Compare CPM efficiency across providers
- Recommend frequency caps and budget allocation percentages
- Flag overlap/deduplication concerns
- Reference geo holdout testing methodology for measurement

## What You Know
You have access to:
1. Advertiser complete competitive intelligence (traffic, SEO, trends, news, customer reviews)
2. Detailed CTV/TV platform knowledge (CPMs, audiences, targeting capabilities)
3. Advertiser customer demographics and geographic footprint
4. Competitor advertising intelligence and spend estimates

## Important Rules
- Never make up data points — only reference what's in the intelligence data or CTV knowledge base
- If you don't know something specific, say so and suggest how to find out
- Format responses with headers, bullets, and tables for executive readability
- Keep responses focused — don't dump everything, answer what was asked
- When discussing budgets, use realistic ranges based on the advertiser's apparent scale

{CTV_KNOWLEDGE}
"""


# ===================
# App Setup
# ===================

app = FastAPI(title=ADVISOR_TITLE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Signal data at startup
signal_context = ""
try:
    signal_context = load_signal_context()
    logger.info(f"Loaded Signal context: {len(signal_context):,} chars from {SIGNAL_DATA_DIR}")
except Exception as e:
    logger.error(f"Failed to load Signal data: {e}")

# ===================
# Models
# ===================

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    company: str = DEFAULT_COMPANY

class ChatResponse(BaseModel):
    response: str
    model: str
    context_size: int


# ===================
# Endpoints
# ===================

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": MODEL,
        "context_loaded": len(signal_context) > 0,
        "context_chars": len(signal_context),
        "data_dir": str(SIGNAL_DATA_DIR),
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Send a message to the strategic advisor."""
    if not signal_context:
        raise HTTPException(status_code=503, detail="Signal intelligence data not loaded")

    # Build messages with context
    messages = []

    # Add Signal data as first user message (context injection)
    context_message = f"""Here is the current intelligence data for {DISPLAY_COMPANY} from TAU Signal:

{signal_context}

---
Use this data to inform your responses. Reference specific data points when relevant."""

    messages.append({"role": "user", "content": context_message})
    messages.append({"role": "assistant", "content": f"Understood. I have the full {DISPLAY_COMPANY} intelligence briefing loaded. I can see traffic data, competitive positioning, customer sentiment, SEO metrics, ad intelligence, and market trends. Ready to advise on CTV strategy, audience personas, and media planning. What would you like to explore?"})

    # Add conversation history (trimmed)
    for msg in req.history[-MAX_HISTORY:]:
        messages.append({"role": msg.role, "content": msg.content})

    # Add current message
    messages.append({"role": "user", "content": req.message})

    try:
        if ACTIVE_PROVIDER == "anthropic":
            response = client.messages.create(
                model=MODEL,
                max_tokens=MAX_TOKENS,
                system=SYSTEM_PROMPT,
                messages=messages,
            )
            reply = response.content[0].text
        else:
            # OpenAI format — system prompt as first message
            oai_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            oai_messages.extend(messages)
            response = client.chat.completions.create(
                model=MODEL,
                max_tokens=MAX_TOKENS,
                messages=oai_messages,
            )
            reply = response.choices[0].message.content

        return ChatResponse(
            response=reply,
            model=MODEL,
            context_size=len(signal_context),
        )

    except Exception as e:
        logger.error(f"AI API error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")


@app.get("/context/summary")
async def context_summary():
    """Return a summary of loaded intelligence data."""
    return {
        "company": DISPLAY_COMPANY,
        "data_dir": str(SIGNAL_DATA_DIR),
        "context_chars": len(signal_context),
        "sections": [line.replace("## ", "").strip()
                     for line in signal_context.split("\n")
                     if line.startswith("## ")],
    }


# ===================
# Run
# ===================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=3002, reload=True)
