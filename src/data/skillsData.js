/**
 * TAU Skills Reference Data
 * 
 * All 22 TAU skills available as structured data for UI panels, AI context injection,
 * and reference material throughout the TAU Reporting platform.
 * 
 * Source: /home/r2/TAU_Skills/skills/
 * Also available via API: GET /api/skills, GET /api/skills/:id
 */

export const TAU_SKILLS = [
  {
    id: 'abm-prospecting',
    name: 'ABM Prospecting',
    category: 'strategy',
    icon: '🎯',
    shortDesc: 'Account-based marketing prospecting and ICP definition',
    fullDesc: 'TAU methodology for building and prioritising target account lists that are commercially credible. Covers ICP definition, Companies House enrichment, intent scoring, and outbound strategy.',
    frameworks: ['Account Build Workflow', 'TAU Qualification Lens (Fit/Trigger/Spend/Reachability/Proof)'],
    useCases: ['ICP definition', 'Account list building', 'Firmographic enrichment', 'Outbound prioritisation'],
    relevantVerticals: ['b2b', 'saas', 'professional services'],
  },
  {
    id: 'attribution-diagnostic',
    name: 'Attribution Diagnostic',
    category: 'measurement',
    icon: '📊',
    shortDesc: 'Diagnose and fix attribution model health',
    fullDesc: 'Systematic approach to diagnosing attribution model health, identifying measurement gaps, and recommending fit-for-purpose attribution frameworks for different business models.',
    frameworks: ['Attribution Health Check', 'Multi-touch vs Last-click analysis', 'MMM integration'],
    useCases: ['Attribution model audit', 'Measurement gap analysis', 'MMM vs MTA comparison', 'Cross-channel tracking'],
    relevantVerticals: ['all'],
  },
  {
    id: 'audience-graph',
    name: 'Audience Graph',
    category: 'audience',
    icon: '🕸️',
    shortDesc: 'Build audience graphs using Rosetta Stone P×S scoring',
    fullDesc: "TAU's audience graph methodology using the Rosetta Stone P×S (Priority × Strength) scoring framework across 8 targeting mechanisms and ~50 audience attributes.",
    frameworks: ['Rosetta Stone P×S Scoring', '8-Mechanism Framework (KEY/GEO/CRM/CTX/LAL/CHAN/INT/TIME)', 'Blueprint Generation'],
    useCases: ['Audience definition', 'Channel mapping', 'Targeting blueprint creation', 'Cross-channel translation'],
    relevantVerticals: ['all'],
  },
  {
    id: 'blueprint-sprint',
    name: 'Blueprint Sprint',
    category: 'strategy',
    icon: '⚡',
    shortDesc: 'Rapid strategic planning sprint for media and audience blueprints',
    fullDesc: 'A time-boxed sprint process to produce a media and audience blueprint rapidly. Covers scoping, prioritisation, commercial framing, and stakeholder alignment.',
    frameworks: ['Sprint Structure (2-5 days)', 'Scoping Canvas', 'Blueprint Output Format'],
    useCases: ['New client onboarding', 'Strategy refresh', 'Campaign planning kickoff', 'Stakeholder alignment'],
    relevantVerticals: ['all'],
  },
  {
    id: 'brand-building',
    name: 'Brand Building',
    category: 'strategy',
    icon: '🏛️',
    shortDesc: 'Long-term brand growth using Binet & Field econometrics',
    fullDesc: 'Evidence-based brand building strategy using Binet & Field research, Share of Voice principles, and the 60/40 brand-to-activation split framework.',
    frameworks: ['60/40 Brand:Activation Split', 'Share of Voice / Share of Market', 'Binet & Field Effectiveness Model', 'Ehrenberg-Bass Theory'],
    useCases: ['Brand investment justification', 'Media mix strategy', 'Long-term vs short-term balance', 'Brand equity measurement'],
    relevantVerticals: ['fmcg', 'retail', 'gambling', 'insurance', 'finance'],
  },
  {
    id: 'channel-approach',
    name: 'Channel Approach',
    category: 'planning',
    icon: '📡',
    shortDesc: 'Channel selection and weighting framework',
    fullDesc: 'Framework for selecting and weighting media channels based on audience attributes, campaign objectives, and budget constraints. Maps audience to best-fit channels with rationale.',
    frameworks: ['Channel Fit Matrix', 'Audience-Channel Mapping', 'Budget Weighting Logic'],
    useCases: ['Channel mix decisions', 'Budget allocation', 'New channel evaluation', 'Reach optimisation'],
    relevantVerticals: ['all'],
  },
  {
    id: 'commercial-proposal',
    name: 'Commercial Proposal',
    category: 'commercial',
    icon: '💼',
    shortDesc: 'Structure and write client-facing commercial proposals',
    fullDesc: "TAU's framework for writing commercial proposals that win. Covers pricing logic, scope definition, value articulation, and proposal structure that converts.",
    frameworks: ['Proposal Structure Template', 'Pricing Logic (Value vs Cost-plus)', 'Scope Definition Matrix'],
    useCases: ['Client proposals', 'Pricing strategy', 'Scope management', 'Commercial negotiation'],
    relevantVerticals: ['all'],
  },
  {
    id: 'context-engineering',
    name: 'Context Engineering',
    category: 'ai',
    icon: '🤖',
    shortDesc: 'Design AI agent prompts and context structures',
    fullDesc: 'TAU methodology for designing AI agents and context structures. Covers system prompt architecture, multi-agent coordination, context window management, and prompt versioning.',
    frameworks: ['System Prompt Architecture', 'Context Window Management', 'Agent Coordination Patterns', 'Prompt Versioning'],
    useCases: ['AI agent design', 'LLM prompt engineering', 'Multi-agent systems', 'RAG pipeline design'],
    relevantVerticals: ['tech', 'ai', 'all'],
  },
  {
    id: 'ctv-av',
    name: 'CTV / AV',
    category: 'channel',
    icon: '📺',
    shortDesc: 'Connected TV and audio-visual planning',
    fullDesc: 'Comprehensive guide to CTV and AV advertising: reach curves, frequency caps, CPM benchmarks, CTV vs linear trade-offs, programmatic vs direct buying, and measurement frameworks.',
    frameworks: ['CTV Reach Curve Modelling', 'Frequency Optimisation', 'CPM Benchmark Matrix', 'Incremental Reach Analysis'],
    useCases: ['CTV campaign planning', 'AV budget allocation', 'Linear vs digital trade-offs', 'Brand building at scale'],
    relevantVerticals: ['gambling', 'retail', 'fmcg', 'finance', 'automotive'],
  },
  {
    id: 'display',
    name: 'Display Advertising',
    category: 'channel',
    icon: '🖼️',
    shortDesc: 'Programmatic and direct display advertising',
    fullDesc: 'Display advertising strategy covering formats, targeting approaches, viewability standards, brand safety, creative optimisation, and performance benchmarks.',
    frameworks: ['Display Format Matrix', 'Viewability Standards (MRC)', 'Brand Safety Framework', 'Programmatic Tier Strategy'],
    useCases: ['Awareness campaigns', 'Retargeting', 'Contextual targeting', 'Brand safety management'],
    relevantVerticals: ['all'],
  },
  {
    id: 'email',
    name: 'Email Marketing',
    category: 'channel',
    icon: '📧',
    shortDesc: 'Email marketing strategy, lifecycle, and deliverability',
    fullDesc: 'Email marketing strategy covering segmentation, lifecycle programmes, deliverability best practices, creative best practices, automation flows, and measurement.',
    frameworks: ['Lifecycle Stage Mapping', 'Deliverability Checklist', 'Engagement Scoring', 'Send Frequency Optimisation'],
    useCases: ['CRM lifecycle programmes', 'Retention campaigns', 'Reactivation flows', 'Transactional email'],
    relevantVerticals: ['retail', 'gambling', 'saas', 'finance'],
  },
  {
    id: 'media-planning',
    name: 'Media Planning',
    category: 'planning',
    icon: '📋',
    shortDesc: 'Full-funnel media planning and optimisation',
    fullDesc: 'Comprehensive media planning methodology: budget allocation, channel mix, reach & frequency objectives, flighting strategy, and continuous optimisation loops.',
    frameworks: ['Full-Funnel Planning Model', 'Budget Allocation Matrix', 'Reach & Frequency Optimisation', 'Flighting Calendar'],
    useCases: ['Annual media planning', 'Campaign planning', 'Budget redistribution', 'Agency briefing'],
    relevantVerticals: ['all'],
  },
  {
    id: 'meta-social',
    name: 'Meta / Social',
    category: 'channel',
    icon: '📘',
    shortDesc: 'Meta (Facebook/Instagram) and social advertising',
    fullDesc: 'Meta advertising strategy covering audience targeting, creative formats, campaign structure (CBO vs ABO), bidding strategies, creative testing frameworks, and performance benchmarks.',
    frameworks: ['Campaign Structure (CBO/ABO)', 'Creative Testing Framework', 'Audience Layering Strategy', 'Attribution Window Settings'],
    useCases: ['Performance social campaigns', 'Brand awareness', 'App install campaigns', 'Lead generation'],
    relevantVerticals: ['ecommerce', 'gambling', 'apps', 'retail'],
  },
  {
    id: 'paid-search',
    name: 'Paid Search',
    category: 'channel',
    icon: '🔍',
    shortDesc: 'Google and Bing paid search strategy',
    fullDesc: 'Paid search strategy covering keyword research, match types, Quality Score optimisation, smart bidding strategy, Shopping campaigns, and search vs organic trade-offs.',
    frameworks: ['Keyword Architecture', 'Match Type Strategy', 'Smart Bidding Decision Tree', 'Search/Shopping Integration'],
    useCases: ['Brand protection', 'Generic keyword capture', 'Competitor conquesting', 'Shopping campaigns'],
    relevantVerticals: ['ecommerce', 'insurance', 'finance', 'gambling'],
  },
  {
    id: 'programmatic',
    name: 'Programmatic',
    category: 'channel',
    icon: '⚙️',
    shortDesc: 'Programmatic buying: DSP strategy and data activation',
    fullDesc: 'Programmatic advertising strategy covering DSP selection, inventory quality assessment, PMP vs open auction trade-offs, audience data activation, and bid landscape analysis.',
    frameworks: ['Inventory Quality Framework', 'PMP vs OA Decision Matrix', 'Data Activation Hierarchy', 'Bid Strategy Optimisation'],
    useCases: ['Brand-safe programmatic', 'Audience extension', 'Data activation', 'Cross-channel reach'],
    relevantVerticals: ['all'],
  },
  {
    id: 'psychological',
    name: 'Psychological Targeting',
    category: 'audience',
    icon: '🧠',
    shortDesc: 'Psychographic audience modelling and emotional triggers',
    fullDesc: 'Framework for building psychographic audience models based on values, motivations, and emotional triggers. Covers segmentation approaches and mapping psychology to channel and creative strategy.',
    frameworks: ['Values-Based Segmentation', 'Motivation Mapping', 'Emotional Trigger Framework', 'Psychographic-Channel Matrix'],
    useCases: ['Audience insight development', 'Creative strategy', 'Message testing', 'Brand positioning'],
    relevantVerticals: ['all'],
  },
  {
    id: 'rosetta-stone',
    name: 'Rosetta Stone',
    category: 'audience',
    icon: '🗿',
    shortDesc: "TAU's proprietary audience translation framework",
    fullDesc: "TAU's core methodology: translate any audience into 8 targeting mechanisms (KEY, GEO, CRM, CTX, LAL, CHAN, INT, TIME) using P×S (Priority × Strength) scoring. The foundation of all TAU audience work.",
    frameworks: ['8-Mechanism Framework', 'P×S Scoring Matrix', 'Mechanism Priority Ranking', 'Channel Translation Map'],
    useCases: ['All audience-related work', 'Cross-channel strategy', 'Media brief translation', 'Platform targeting setup'],
    relevantVerticals: ['all'],
    isPrimary: true,
  },
  {
    id: 'search',
    name: 'Organic Search (SEO)',
    category: 'channel',
    icon: '🌐',
    shortDesc: 'SEO strategy, content planning, and visibility measurement',
    fullDesc: 'Organic search strategy covering keyword research, technical SEO audit, content strategy, SERP feature optimisation, link building approaches, and search visibility measurement.',
    frameworks: ['Technical SEO Audit Checklist', 'Keyword Opportunity Matrix', 'Content Planning Framework', 'SERP Feature Strategy'],
    useCases: ['SEO strategy', 'Content gap analysis', 'Technical audits', 'AI search optimisation'],
    relevantVerticals: ['all'],
  },
  {
    id: 'social',
    name: 'Organic Social',
    category: 'channel',
    icon: '💬',
    shortDesc: 'Organic social media strategy and community management',
    fullDesc: 'Organic social strategy covering platform selection, content planning, community management principles, influencer identification, social listening, and performance measurement.',
    frameworks: ['Platform Fit Matrix', 'Content Pillar Framework', 'Community Management Principles', 'Influencer Selection Criteria'],
    useCases: ['Brand social presence', 'Community building', 'Influencer strategy', 'Social listening'],
    relevantVerticals: ['retail', 'gambling', 'gaming', 'fmcg'],
  },
  {
    id: 'tau-os',
    name: 'TAU OS',
    category: 'framework',
    icon: '🔷',
    shortDesc: "TAU's operating system for AI-powered marketing consultancy",
    fullDesc: "The TAU Operating System: the complete methodology for running AI-powered marketing consultancy. Covers agent orchestration, client delivery frameworks, quality control, and TAU's core principles.",
    frameworks: ['Agent Orchestration Model', 'Client Delivery Framework', 'Quality Gates', 'TAU Principles'],
    useCases: ['Internal methodology', 'Client delivery', 'AI agent design', 'Team training'],
    relevantVerticals: ['all'],
    isInternal: true,
  },
  {
    id: 'tv-av',
    name: 'TV / AV (Linear)',
    category: 'channel',
    icon: '📡',
    shortDesc: 'Linear TV and video advertising planning',
    fullDesc: 'Linear TV advertising strategy covering BARB audience data, buying mechanics (spot vs sponsorship), daypart strategy, TV-digital attribution, and sponsorship packages.',
    frameworks: ['BARB Audience Planning', 'Daypart Strategy', 'Sponsorship Evaluation Matrix', 'TV-Digital Attribution'],
    useCases: ['Linear TV planning', 'Sponsorship evaluation', 'Brand campaigns', 'TV attribution'],
    relevantVerticals: ['fmcg', 'retail', 'gambling', 'finance'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'channel',
    icon: '▶️',
    shortDesc: 'YouTube advertising formats, targeting, and measurement',
    fullDesc: 'YouTube advertising strategy covering ad formats (skippable, non-skippable, bumper, masthead), audience targeting (custom intent, in-market, affinity), content adjacency, and view-through measurement.',
    frameworks: ['Format Selection Matrix', 'Audience Targeting Layers', 'Content Adjacency Strategy', 'View-Through Attribution'],
    useCases: ['Video brand campaigns', 'Performance video', 'Reach extension from TV', 'Creator partnerships'],
    relevantVerticals: ['gambling', 'gaming', 'fmcg', 'retail', 'tech'],
  },
];

export const SKILL_CATEGORIES = {
  strategy: { label: 'Strategy', color: 'purple', icon: '🎯' },
  measurement: { label: 'Measurement', color: 'blue', icon: '📊' },
  audience: { label: 'Audience', color: 'green', icon: '👥' },
  planning: { label: 'Planning', color: 'yellow', icon: '📋' },
  commercial: { label: 'Commercial', color: 'orange', icon: '💼' },
  ai: { label: 'AI & Tech', color: 'cyan', icon: '🤖' },
  channel: { label: 'Channel', color: 'red', icon: '📡' },
  framework: { label: 'Framework', color: 'gray', icon: '🔷' },
};

/**
 * Get skills by category
 */
export function getSkillsByCategory(category) {
  return TAU_SKILLS.filter(s => s.category === category);
}

/**
 * Get skills relevant to a specific vertical/industry
 */
export function getSkillsForVertical(vertical) {
  return TAU_SKILLS.filter(s => 
    s.relevantVerticals.includes('all') || 
    s.relevantVerticals.some(v => vertical?.toLowerCase().includes(v))
  );
}

/**
 * Get primary/foundational skills (always relevant)
 */
export function getPrimarySkills() {
  return TAU_SKILLS.filter(s => s.isPrimary);
}

/**
 * Build AI system context string from relevant skills
 */
export function buildSkillsContext(skillIds) {
  const skills = skillIds
    ? TAU_SKILLS.filter(s => skillIds.includes(s.id))
    : TAU_SKILLS;
  
  return skills
    .map(s => `## ${s.name}\n${s.fullDesc}\n\nKey frameworks: ${s.frameworks.join(', ')}`)
    .join('\n\n---\n\n');
}

export default TAU_SKILLS;
