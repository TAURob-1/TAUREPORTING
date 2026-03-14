import { describe, it, expect } from 'vitest';
import { parseAIResponse, extractGraphActions } from '../../utils/plannerResponseParser.js';

describe('extractGraphActions', () => {
  it('extracts navigate action', () => {
    const text = 'Let me show you the audience graph [GRAPH:navigate] for this audience.';
    const result = extractGraphActions(text);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'navigate' });
  });

  it('extracts drilldown action', () => {
    const text = 'Check the channel details [GRAPH:drilldown:M_CHAN] for platform affinities.';
    const result = extractGraphActions(text);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'drilldown', mechanism: 'M_CHAN' });
  });

  it('extracts load_template action', () => {
    const text = 'Loading the skier template [GRAPH:load_template:young_affluent_skiers] now.';
    const result = extractGraphActions(text);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toEqual({ type: 'load_template', template: 'young_affluent_skiers' });
  });

  it('extracts multiple actions', () => {
    const text = '[GRAPH:load_template:business_travellers] and [GRAPH:drilldown:M_TIME]';
    const result = extractGraphActions(text);
    expect(result.actions).toHaveLength(2);
  });

  it('returns empty for no graph tags', () => {
    const text = 'This is a normal response without any special tags.';
    const result = extractGraphActions(text);
    expect(result.actions).toHaveLength(0);
  });

  it('handles case insensitivity', () => {
    const text = '[graph:Navigate] works too';
    const result = extractGraphActions(text);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].type).toBe('navigate');
  });
});

describe('parseAIResponse with graph actions', () => {
  it('includes graphActions in parsed result', () => {
    const text = '## Layer 3\nHere is the plan [GRAPH:drilldown:M_CHAN]';
    const result = parseAIResponse(text);

    expect(result.graphActionsDetected).toBe(true);
    expect(result.graphActions).toHaveLength(1);
    expect(result.graphActions[0].type).toBe('drilldown');
  });

  it('existing parsing still works', () => {
    const text = `## Layer 3
Channel Planning

Flight 1: Awareness
- Dates: Jan-Feb 2026
- Budget: £500k
- Channels: YouTube CTV, ITVX
- Objective: Build reach`;

    const result = parseAIResponse(text);
    expect(result.mediaPlanDetected).toBe(true);
    expect(result.flightingDetected).toBe(true);
    expect(result.flightingData).toHaveLength(1);
    expect(result.layersDetected).toContain(3);
    expect(result.graphActionsDetected).toBe(false);
  });
});
