# Component Blueprint (REVISED)

## Target UX Structure (Simplified)
**3 Main Tabs in AI Planner:**
1. **Chat** - 7-layer planning conversation
2. **Media Plan** - Markdown artifact view/edit
3. **System Prompt** - View/edit prompt template

**Integrated with Existing Pages:**
- **Flighting** → outputs to existing "Campaign Planning" page
- **Personas** → outputs to existing "Audience Targeting" page (with map)
- **Data Sources** → sub-menu/dropdown (not main tab)

## New Components

### Core Planner Components
- `src/components/planner/PlannerWorkspace.jsx`
  - Owns 3-tab switching and shared layout
  - Sub-menu for Data Sources access
- `src/components/planner/PlannerHeader.jsx`
  - Shows advertiser/country, mode, status
- `src/components/planner/PlannerTabs.jsx`
  - 3-tab navigation UI (Chat, Media Plan, System Prompt)

### Tab Components
- `src/components/planner/tabs/ChatTab.jsx`
  - Chat panel with 7-layer framework guidance
  - Suggestions, send action, streaming/fallback
- `src/components/planner/tabs/MediaPlanTab.jsx`
  - Markdown view/edit for media plan output
  - Copy/export functionality
- `src/components/planner/tabs/SystemPromptTab.jsx`
  - View/edit 7-layer system prompt
  - Reset to default template button

### Sub-menu Component
- `src/components/planner/DataSourcesMenu.jsx`
  - Dropdown/modal showing active Signal context blocks
  - Toggles for including traffic, SEO, spend, insights data

## Modified Components

### `src/components/StrategicAdvisor.jsx`
- Reduce to compatibility wrapper around `PlannerWorkspace`
- Maintains existing route/import path

### `src/App.jsx`
- Move advisor page to first position in PAGES array
- Rename: `fullLabel: "AI Planner"`, `label: "Planner"`

### `src/components/CampaignPlanning.jsx`
- Add section to receive/display flighting outputs from AI Planner
- Flight timeline, budget breakdown by channel
- Integration point for Layer 7 (Flighting and Phasing)

### `src/components/AudienceTargeting.jsx`
- Add section to receive/display persona outputs from AI Planner
- Persona cards, audience definitions
- Integration point for Layer 4 (Audience and Data Planning)

## State Ownership

### PlannerContext (Shared State)
```javascript
{
  // 7-layer planning state
  layerProgress: {}, // Which layers completed
  
  // Artifacts
  mediaPlan: { markdown: '', lastUpdated: '' },
  
  // Outputs to other pages
  flightingOutput: [], // → Campaign Planning
  personasOutput: [], // → Audience Targeting
  
  // Configuration
  systemPrompt: '',
  selectedDataSources: [],
  
  // Session
  chatHistory: [],
  decisions: [],
  logs: []
}
```

### State Flow
1. **ChatTab** → generates outputs for:
   - `mediaPlan.markdown` (viewed in Media Plan tab)
   - `flightingOutput` (pushed to Campaign Planning page)
   - `personasOutput` (pushed to Audience Targeting page)

2. **MediaPlanTab** → manual edits update `mediaPlan.markdown`

3. **SystemPromptTab** → edits update `systemPrompt` for next chat turn

4. **DataSourcesMenu** → toggles update `selectedDataSources` included in chat payload

## Tab Interaction Contract

### Chat Tab (AI Conversation)
- Accepts user messages about any of 7 layers
- Sends context envelope including:
  - Platform context (country, advertiser)
  - Signal context (from selected data sources)
  - Current planner state
  - System prompt (7-layer framework)
- Updates outputs based on AI responses:
  - Media plan markdown
  - Flighting data → Campaign Planning
  - Personas data → Audience Targeting

### Media Plan Tab
- Read-only view of AI-generated plan
- Optional manual editing
- Copy/export functionality

### System Prompt Tab
- View current 7-layer prompt template
- Edit for customization
- Reset to default button

### Data Sources (Sub-menu)
- Shows which Signal data blocks are active
- Toggle traffic/SEO/spend/insights sections
- Updates context envelope for next chat turn

## Integration Points with Existing Pages

### Campaign Planning Integration
```javascript
// Campaign Planning receives flighting output
const { flightingOutput } = usePlannerContext()

// Display AI-generated flights alongside manual planning
<FlightingSection flights={flightingOutput} source="ai-planner" />
```

### Audience Targeting Integration
```javascript
// Audience Targeting receives personas output
const { personasOutput } = usePlannerContext()

// Display AI-generated personas alongside map
<PersonasSection personas={personasOutput} source="ai-planner" />
```

## Recommended Render Hierarchy
```txt
StrategicAdvisor (wrapper)
  PlannerWorkspace
    PlannerHeader
    DataSourcesMenu (sub-menu)
    PlannerTabs (3 tabs)
    ActiveTabPanel
      ChatTab
      MediaPlanTab
      SystemPromptTab
```

## Data Source Mapping (tau-demo → TAU)
- tau-demo `all_data_sources` → TAU Signal intelligence blocks
- Selected sources included in chat context envelope:
  - Traffic intelligence
  - SEO data
  - AI visibility metrics
  - Competitor insights
  - Spend estimates
- Keep same mental model: selected sources = context for AI planning

## Naming Conventions
- **Navigation label:** `AI Planner`
- **Page title:** `Media Planning Agent`
- **Component namespace:** `planner/`
- **Context provider:** `PlannerContext`

## 7-Layer Framework Focus
All AI planning conversations structured around:
1. Strategic Comms Planning
2. Comms Channel Planning
3. Channel Planning (with 3.A/3.B implementation blueprint)
4. Audience and Data Planning → outputs to Audience Targeting
5. Measurement Planning
6. Message and Creative Planning
7. Flighting and Phasing → outputs to Campaign Planning

Layers 8-10 (Martech/Ops, AI/Simulation, Continuous Optimization) excluded from scope.
