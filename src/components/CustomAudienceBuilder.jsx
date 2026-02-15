import React, { useState, useRef, useCallback } from 'react';
import {
  DEMOGRAPHIC_DIMENSIONS,
  matchNLPDescription,
  processCSVData,
  buildDemographicCriteria,
  getZIPRegionLabel
} from '../data/customAudienceConfig';
import { scoreZIPsForAudience } from '../data/audienceDefinitions';

const TABS = [
  { id: 'upload', label: 'Upload Data', icon: '\uD83D\uDCC1' },
  { id: 'nlp', label: 'Natural Language', icon: '\uD83D\uDCAC' },
  { id: 'builder', label: 'Demographic Builder', icon: '\uD83C\uDF9B\uFE0F' }
];

const CustomAudienceBuilder = ({ onCreateAudience, onClose, demographicsData }) => {
  const [activeTab, setActiveTab] = useState('upload');

  // Upload state
  const [csvText, setCsvText] = useState('');
  const [csvResult, setCsvResult] = useState(null);
  const [csvError, setCsvError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // NLP state
  const [nlpInput, setNlpInput] = useState('');
  const [nlpMatch, setNlpMatch] = useState(null);
  const [nlpSearched, setNlpSearched] = useState(false);

  // Builder state
  const [audienceName, setAudienceName] = useState('');
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState([]);
  const [ageWeight, setAgeWeight] = useState(40);
  const [incomeWeight, setIncomeWeight] = useState(40);
  const [builderPreview, setBuilderPreview] = useState(null);

  const householdWeight = Math.max(0, 100 - ageWeight - incomeWeight);

  // ── CSV Upload handlers ───────────────────────────────────────
  const handleFileRead = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvText(e.target.result);
      setCsvResult(null);
      setCsvError('');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      handleFileRead(file);
    } else {
      setCsvError('Please drop a CSV file');
    }
  }, [handleFileRead]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileRead(file);
  }, [handleFileRead]);

  const handleProcessCSV = () => {
    const result = processCSVData(csvText);
    if (result.error) {
      setCsvError(result.error);
      setCsvResult(null);
    } else {
      setCsvError('');
      setCsvResult(result);
    }
  };

  const handleUseCSVAudience = () => {
    if (!csvResult) return;
    const audience = {
      id: `custom_csv_${Date.now()}`,
      name: 'CSV Upload Audience',
      description: `${csvResult.zipCount} ZIP regions from uploaded data`,
      icon: '\uD83D\uDCC1',
      color: '#6366f1',
      criteria: [],
      isCustom: true,
      csvAffinityMap: csvResult.affinityMap,
      isCSVBased: true
    };
    onCreateAudience(audience);
  };

  // ── NLP handlers ──────────────────────────────────────────────
  const handleAnalyzeNLP = () => {
    setNlpSearched(true);
    const match = matchNLPDescription(nlpInput);
    setNlpMatch(match);
  };

  const handleUseNLPAudience = () => {
    if (!nlpMatch) return;
    const audience = {
      id: `custom_nlp_${Date.now()}`,
      name: nlpMatch.name,
      description: nlpMatch.description,
      icon: '\u2728',
      color: '#8b5cf6',
      criteria: nlpMatch.criteria,
      isCustom: true
    };
    onCreateAudience(audience);
  };

  // ── Builder handlers ──────────────────────────────────────────
  const toggleSelection = (list, setList, id) => {
    setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setBuilderPreview(null);
  };

  const handlePreviewBuilder = () => {
    const criteria = buildDemographicCriteria(selectedAge, selectedIncome, selectedHousehold, ageWeight, incomeWeight);
    if (criteria.length === 0 || !demographicsData) {
      setBuilderPreview(null);
      return;
    }

    const tempAudience = { id: 'preview', name: 'Preview', criteria };
    const scored = scoreZIPsForAudience(demographicsData, tempAudience);
    const matching = scored.filter(z => z.score >= 40);
    const totalHouseholds = matching.reduce((sum, z) => sum + (z.demographics?.households || 0), 0);

    setBuilderPreview({
      matchingZips: matching.length,
      totalHouseholds,
      avgScore: matching.length > 0 ? Math.round(matching.reduce((s, z) => s + z.score, 0) / matching.length) : 0
    });
  };

  const handleUseBuilderAudience = () => {
    const criteria = buildDemographicCriteria(selectedAge, selectedIncome, selectedHousehold, ageWeight, incomeWeight);
    if (criteria.length === 0) return;

    const name = audienceName.trim() || 'My Custom Audience';
    const descParts = [];
    if (selectedAge.length > 0) {
      const labels = DEMOGRAPHIC_DIMENSIONS.ageRanges
        .filter(a => selectedAge.includes(a.id))
        .map(a => a.label);
      descParts.push(`Age ${labels.join(', ')}`);
    }
    if (selectedIncome.length > 0) {
      const labels = DEMOGRAPHIC_DIMENSIONS.incomeRanges
        .filter(i => selectedIncome.includes(i.id))
        .map(i => i.label);
      descParts.push(`Income ${labels.join(', ')}`);
    }

    const audience = {
      id: `custom_builder_${Date.now()}`,
      name,
      description: descParts.join(', ') || 'Custom demographic profile',
      icon: '\uD83C\uDF9B\uFE0F',
      color: '#6366f1',
      criteria,
      isCustom: true
    };
    onCreateAudience(audience);
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Custom Audience</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Upload Tab ─────────────────────────────── */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
              >
                <div className="text-3xl mb-2">{csvText ? '\u2705' : '\uD83D\uDCC1'}</div>
                <div className="text-sm font-medium text-gray-700">
                  {csvText ? 'File loaded - click to replace' : 'Drop CSV file here or click to browse'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Format: ZIP code, Sales/Conversions</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Sample format */}
              {!csvText && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-1">Sample format:</div>
                  <pre className="text-xs text-gray-500 font-mono">
{`zip,sales
10001,245
10002,189
90210,312
60601,156`}
                  </pre>
                </div>
              )}

              {/* CSV Preview */}
              {csvText && !csvResult && (
                <div>
                  <div className="text-xs text-gray-500 mb-2">
                    Preview: {csvText.split('\n').length - 1} rows loaded
                  </div>
                  <button
                    onClick={handleProcessCSV}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Process Data &rarr;
                  </button>
                </div>
              )}

              {csvError && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-200">
                  {csvError}
                </div>
              )}

              {/* CSV Results */}
              {csvResult && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-semibold text-sm">\u2705 Data Processed</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>Found <strong>{csvResult.zipCount}</strong> ZIP regions from <strong>{csvResult.totalRows}</strong> rows</div>
                      <div className="text-xs text-gray-500">
                        Top regions: {csvResult.topRegions.map(z => `${z} (${getZIPRegionLabel(z)})`).join(', ')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleUseCSVAudience}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Use This Audience &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── NLP Tab ────────────────────────────────── */}
          {activeTab === 'nlp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your target audience:</label>
                <input
                  type="text"
                  value={nlpInput}
                  onChange={(e) => { setNlpInput(e.target.value); setNlpSearched(false); setNlpMatch(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyzeNLP(); }}
                  placeholder='e.g. "crypto enthusiasts" or "young parents who love fitness"'
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={handleAnalyzeNLP}
                disabled={!nlpInput.trim()}
                className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Analyze &rarr;
              </button>

              {/* Match result */}
              {nlpSearched && nlpMatch && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 font-semibold text-sm">\u2705 Matched: &ldquo;{nlpMatch.name}&rdquo;</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">{nlpMatch.description}</div>

                    <div className="text-xs font-medium text-gray-700 mb-2">Demographic Profile:</div>
                    <div className="space-y-2">
                      {nlpMatch.criteria.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="text-xs text-gray-600 w-28 truncate">{formatFieldLabel(c.field)}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${c.weight}%` }}
                            />
                          </div>
                          <div className="text-xs font-medium text-gray-700 w-8 text-right">{c.weight}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleUseNLPAudience}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                  >
                    Use This Audience &rarr;
                  </button>
                </div>
              )}

              {/* No match */}
              {nlpSearched && !nlpMatch && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-sm text-amber-800 font-medium mb-1">No match found</div>
                  <div className="text-xs text-amber-700">
                    Try keywords like: crypto, luxury, fitness, gamers, pet owners, foodies, travel, eco, DIY, fashion, streaming, retirees, college, freelancers, sports betting, health
                  </div>
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    &rarr; Use the Demographic Builder instead
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Builder Tab ────────────────────────────── */}
          {activeTab === 'builder' && (
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Audience Name</label>
                <input
                  type="text"
                  value={audienceName}
                  onChange={(e) => setAudienceName(e.target.value)}
                  placeholder="My Custom Audience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Age Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Age Range</label>
                  <span className="text-xs text-gray-500">Weight: {ageWeight}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {DEMOGRAPHIC_DIMENSIONS.ageRanges.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => toggleSelection(selectedAge, setSelectedAge, opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedAge.includes(opt.id)
                          ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {selectedAge.includes(opt.id) ? '\u2611' : '\u2610'} {opt.label}
                    </button>
                  ))}
                </div>
                <input
                  type="range" min="0" max="80" step="5"
                  value={ageWeight}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setAgeWeight(v);
                    if (v + incomeWeight > 100) setIncomeWeight(100 - v);
                    setBuilderPreview(null);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Income */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Income Level</label>
                  <span className="text-xs text-gray-500">Weight: {incomeWeight}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {DEMOGRAPHIC_DIMENSIONS.incomeRanges.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => toggleSelection(selectedIncome, setSelectedIncome, opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedIncome.includes(opt.id)
                          ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {selectedIncome.includes(opt.id) ? '\u2611' : '\u2610'} {opt.label}
                    </button>
                  ))}
                </div>
                <input
                  type="range" min="0" max="80" step="5"
                  value={incomeWeight}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setIncomeWeight(v);
                    if (v + ageWeight > 100) setAgeWeight(100 - v);
                    setBuilderPreview(null);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Household Type */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Household Type</label>
                  <span className="text-xs text-gray-500">Weight: {householdWeight}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEMOGRAPHIC_DIMENSIONS.householdTypes.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => toggleSelection(selectedHousehold, setSelectedHousehold, opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedHousehold.includes(opt.id)
                          ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {selectedHousehold.includes(opt.id) ? '\u2611' : '\u2610'} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Button */}
              <button
                onClick={handlePreviewBuilder}
                disabled={selectedAge.length === 0 && selectedIncome.length === 0 && selectedHousehold.length === 0}
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium border border-gray-300"
              >
                Preview Audience &rarr;
              </button>

              {/* Preview Results */}
              {builderPreview && (
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-indigo-600">{builderPreview.matchingZips}</div>
                      <div className="text-xs text-gray-600">Matching ZIPs</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-600">
                        {builderPreview.totalHouseholds >= 1000000
                          ? `${(builderPreview.totalHouseholds / 1000000).toFixed(1)}M`
                          : `${(builderPreview.totalHouseholds / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-xs text-gray-600">Est. Households</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-600">{builderPreview.avgScore}</div>
                      <div className="text-xs text-gray-600">Avg Affinity</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Use Audience */}
              {(builderPreview || (selectedAge.length > 0 || selectedIncome.length > 0 || selectedHousehold.length > 0)) && (
                <button
                  onClick={handleUseBuilderAudience}
                  disabled={selectedAge.length === 0 && selectedIncome.length === 0 && selectedHousehold.length === 0}
                  className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Use This Audience &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** Convert field names to human-readable labels */
function formatFieldLabel(field) {
  const labels = {
    'age_under_25_pct': 'Age Under 25',
    'age_25_44_pct': 'Age 25-44',
    'age_45_64_pct': 'Age 45-64',
    'age_65_plus_pct': 'Age 65+',
    'income_under_50k': 'Income <$50K',
    'income_50_75k': 'Income $50-75K',
    'income_75_100k': 'Income $75-100K',
    'income_100k_plus': 'Income $100K+',
    'income_150k_plus': 'Income $150K+',
    'households_young_pct': 'Young HH',
    'households_middle_pct': 'Family HH',
    'households_senior_pct': 'Senior HH'
  };
  return labels[field] || field;
}

export default CustomAudienceBuilder;
