import React, { lazy, Suspense } from 'react';

const ChannelDrillDown = lazy(() => import('./drilldowns/ChannelDrillDown.jsx'));
const KeywordDrillDown = lazy(() => import('./drilldowns/KeywordDrillDown.jsx'));
const TemporalDrillDown = lazy(() => import('./drilldowns/TemporalDrillDown.jsx'));
const InterestDrillDown = lazy(() => import('./drilldowns/InterestDrillDown.jsx'));
const ContextualDrillDown = lazy(() => import('./drilldowns/ContextualDrillDown.jsx'));
const CRMDrillDown = lazy(() => import('./drilldowns/CRMDrillDown.jsx'));
const LookalikeDrillDown = lazy(() => import('./drilldowns/LookalikeDrillDown.jsx'));

const DRILL_DOWN_MAP = {
  M_CHAN: ChannelDrillDown,
  M_KEY: KeywordDrillDown,
  M_TIME: TemporalDrillDown,
  M_INT: InterestDrillDown,
  M_CTX: ContextualDrillDown,
  M_CRM: CRMDrillDown,
  M_LAL: LookalikeDrillDown,
};

const DRILL_DOWN_LABELS = {
  M_GEO: 'Geographic / Demographic',
  M_CHAN: 'Channel Selection',
  M_KEY: 'Search / Keyword',
  M_TIME: 'Temporal',
  M_INT: 'Interest / Behavioral',
  M_CTX: 'Contextual',
  M_CRM: 'CRM / First-Party',
  M_LAL: 'Lookalike / Modeling',
};

export default function DrillDownPanel({ activeDrillDown, selectedAttributes, blueprint, onClose }) {
  if (!activeDrillDown) return null;

  // M_GEO uses Atlas link (external) — no in-app drill-down
  if (activeDrillDown === 'M_GEO') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">Geographic / Demographic Drill-Down</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 text-sm">Close</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Geographic drill-down uses the Atlas Segments tool. Click "Atlas Map" on the Geo-Demo mechanism card above to explore geographic targeting.
        </p>
      </div>
    );
  }

  const Component = DRILL_DOWN_MAP[activeDrillDown];
  if (!Component) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
          {DRILL_DOWN_LABELS[activeDrillDown]} Drill-Down
        </h3>
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          Close
        </button>
      </div>
      <Suspense fallback={<div className="text-sm text-gray-400 py-4">Loading drill-down...</div>}>
        <Component selectedAttributes={selectedAttributes} blueprint={blueprint} />
      </Suspense>
    </div>
  );
}
