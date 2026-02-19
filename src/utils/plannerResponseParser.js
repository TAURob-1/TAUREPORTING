function uniqueNumbers(values) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function parseMoneyValue(value) {
  if (!value) return null;
  const normalized = value.replace(/,/g, '').trim();
  const match = normalized.match(/(\d+(?:\.\d+)?)(k|m)?/i);
  if (!match) return null;

  const amount = Number.parseFloat(match[1]);
  if (Number.isNaN(amount)) return null;

  const unit = (match[2] || '').toLowerCase();
  if (unit === 'm') return Math.round(amount * 1000000);
  if (unit === 'k') return Math.round(amount * 1000);
  return Math.round(amount);
}

function extractLayerNumbers(text) {
  const byHeader = [...text.matchAll(/##\s*Layer\s*(\d+)/gi)].map((match) => Number.parseInt(match[1], 10));
  const byMention = [...text.matchAll(/\bLayer\s*(\d)\b/gi)].map((match) => Number.parseInt(match[1], 10));
  return uniqueNumbers([...byHeader, ...byMention].filter((layer) => layer >= 1 && layer <= 7));
}

function extractFlights(text) {
  const lines = text.split('\n');
  const flights = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    flights.push({
      ...current,
      details: current.details.filter(Boolean),
    });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const headingMatch = line.match(/^(?:[-*]\s*)?Flight\s+(\d+)\s*:\s*(.+)$/i);
    if (headingMatch) {
      pushCurrent();
      current = {
        id: `flight-${headingMatch[1]}`,
        name: headingMatch[2].trim(),
        dates: '',
        budgetText: '',
        budgetValue: null,
        channels: [],
        objective: '',
        details: [],
      };
      continue;
    }

    if (!current) continue;

    const detailLine = line.replace(/^[-*]\s*/, '').trim();
    if (!detailLine) continue;
    current.details.push(detailLine);

    const datesMatch = detailLine.match(/^Dates?\s*:\s*(.+)$/i);
    if (datesMatch) {
      current.dates = datesMatch[1].trim();
      continue;
    }

    const budgetMatch = detailLine.match(/^Budget\s*:\s*(.+)$/i);
    if (budgetMatch) {
      current.budgetText = budgetMatch[1].trim();
      current.budgetValue = parseMoneyValue(current.budgetText);
      continue;
    }

    const channelsMatch = detailLine.match(/^Channels?\s*:\s*(.+)$/i);
    if (channelsMatch) {
      current.channels = channelsMatch[1]
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      continue;
    }

    const objectiveMatch = detailLine.match(/^Objective\s*:\s*(.+)$/i);
    if (objectiveMatch) {
      current.objective = objectiveMatch[1].trim();
    }
  }

  pushCurrent();
  return flights;
}

function extractPersonas(text) {
  const lines = text.split('\n');
  const personas = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    personas.push({
      ...current,
      traits: current.traits.filter(Boolean),
    });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const personaMatch = line.match(/^(?:[-*]\s*)?(?:Primary|Secondary|Tertiary)?\s*Persona(?:s)?\s*:\s*(.+)$/i);
    if (personaMatch) {
      pushCurrent();
      current = {
        id: `persona-${personas.length + 1}`,
        name: personaMatch[1].trim(),
        age: '',
        income: '',
        behaviors: '',
        mediaHabits: '',
        traits: [],
      };
      continue;
    }

    if (!current) continue;

    const detailLine = line.replace(/^[-*]\s*/, '').trim();
    if (!detailLine) continue;
    current.traits.push(detailLine);

    const ageMatch = detailLine.match(/^Age\s*:\s*(.+)$/i);
    if (ageMatch) {
      current.age = ageMatch[1].trim();
      continue;
    }

    const incomeMatch = detailLine.match(/^Income\s*:\s*(.+)$/i);
    if (incomeMatch) {
      current.income = incomeMatch[1].trim();
      continue;
    }

    const behaviorsMatch = detailLine.match(/^Behaviou?rs?\s*:\s*(.+)$/i);
    if (behaviorsMatch) {
      current.behaviors = behaviorsMatch[1].trim();
      continue;
    }

    const mediaHabitsMatch = detailLine.match(/^Media habits?\s*:\s*(.+)$/i);
    if (mediaHabitsMatch) {
      current.mediaHabits = mediaHabitsMatch[1].trim();
    }
  }

  pushCurrent();
  return personas;
}

export function parseAIResponse(responseText) {
  const text = typeof responseText === 'string' ? responseText : '';
  const layersDetected = extractLayerNumbers(text);
  const hasLayerHeaders = /##\s*Layer\s*\d+/i.test(text);
  const flightingData = extractFlights(text);
  const personasData = extractPersonas(text);

  return {
    mediaPlanDetected: hasLayerHeaders,
    mediaPlanContent: hasLayerHeaders ? text : '',
    flightingDetected: flightingData.length > 0,
    flightingData,
    personasDetected: personasData.length > 0,
    personasData,
    layersDetected,
  };
}

