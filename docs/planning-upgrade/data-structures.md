# Data Structure Specification (TAU-Reporting Planner)

## Core State Shape

```ts
type PlannerLayerKey =
  | "layer1" | "layer2" | "layer3" | "layer4" | "layer5"
  | "layer6" | "layer7" | "layer8" | "layer9" | "layer10";

type DataSourceRef = {
  id: string;
  type: "signal" | "manual";
  label: string;
  path?: string;
  selected: boolean;
  lastUpdated?: string;
};

type FlightBudget = {
  amount: number;
  currency: "USD" | "GBP" | string;
};

type Flight = {
  id: string;
  channel: string;
  label?: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  budget?: FlightBudget;
  notes?: string;
};

type Persona = {
  id: string;
  name: string;
  demographics?: string;
  motivations?: string;
  channels?: string[];
  messages?: string[];
  pains?: string[];
  signalEvidence?: string[]; // references to Signal insights
};

type MediaPlanArtifact = {
  markdown: string;
  updatedAt?: string;
  completedLayers: PlannerLayerKey[];
  assumptions: string[];
};

type PlannerDecisions = {
  selectedLayers: PlannerLayerKey[];
  routesByLayer: Partial<Record<PlannerLayerKey, string>>;
  guardrails: string[];
  risks: string[];
};

type PlannerSessionState = {
  sessionId: string;
  advertiserId: string;
  advertiserSlug: string;
  countryCode: "US" | "UK" | string;

  systemPrompt: string;
  dataSources: DataSourceRef[];

  mediaPlan: MediaPlanArtifact;
  personasMarkdown: string;
  personas: Persona[];
  flighting: Flight[];

  decisions: PlannerDecisions;
  messages: { role: "user" | "assistant"; content: string; ts: string }[];
  logs: { level: "info" | "warn" | "error"; message: string; done?: boolean; ts: string }[];

  lastSavedAt?: string;
};
```

## Integration with Existing Platform Context

Use `usePlatform()` values as immutable context inputs:
- `countryCode`
- `advertiserId`
- `advertiser` (name/slug/vertical)
- `planningState` (budget, allocations, selected channels, reach/frequency)

Planner session key:
- `tau_planner:${advertiser.slug}:${countryCode}`

On advertiser/country change:
- Save current session.
- Hydrate scoped session if exists.
- Otherwise initialize default planner state.

## Signal Context Model for Planner

```ts
type PlannerSignalContext = {
  signalSource: {
    slug: string;
    company: string;
    country: string;
    updatedAt?: string;
  };
  competitiveSnapshot: {
    advertiserShare: number;
    monthlyVisits: number;
    seoGapCount: number;
    aiVisibilityScore: number;
    topCompetitors: { name: string; share: number }[];
  };
  planningPriorities: string[];
};
```

Use this directly from `getAdvisorContext()` to avoid duplicate transformations.

## Flighting/Phasing Rules
- Dates must be ISO (`YYYY-MM-DD`).
- `end >= start`.
- Currency inferred from country (`US -> USD`, `UK -> GBP`) unless explicitly overridden.
- Channel is free text, but normalize display labels for grouping/timeline views.

## Media Plan Data Model Guidance
- Primary saved artifact remains markdown (`mediaPlan.markdown`) to preserve LLM-native output.
- Add lightweight metadata:
  - `completedLayers`
  - `assumptions`
  - `updatedAt`
- Keep layer-specific structured details in `decisions.routesByLayer` to support deterministic UI summaries.

## Personas Data Model Guidance
- Store both markdown (`personasMarkdown`) and normalized `Persona[]`.
- Markdown is source-of-truth for AI editing.
- Parsed `Persona[]` supports filters, cards, and exports.
