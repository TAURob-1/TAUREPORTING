import React from 'react';

const StatisticalConfidence = ({ confidence }) => {
  const { exposedGroup, holdoutGroup, testResult } = confidence;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistical Confidence</h2>

      <div className="space-y-4">
        {/* Exposed Group */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600">Exposed Group <span className="text-gray-400">(n={exposedGroup.n})</span></span>
            <span className="font-semibold text-emerald-600">{exposedGroup.lift}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${exposedGroup.confidence}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {exposedGroup.confidence}% CI: {exposedGroup.interval}
          </div>
        </div>

        {/* Holdout Group */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600">Holdout Group <span className="text-gray-400">(n={holdoutGroup.n})</span></span>
            <span className="font-semibold text-gray-500">{holdoutGroup.lift}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-gray-300 h-2.5 rounded-full transition-all duration-500"
              style={{ width: '48%' }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{holdoutGroup.note}</div>
        </div>

        {/* Test Result */}
        <div className={`rounded-lg p-4 mt-4 ${testResult.significant ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className={`text-sm font-semibold ${testResult.significant ? 'text-emerald-800' : 'text-amber-800'}`}>
            {testResult.significant ? 'Statistically Significant' : 'Not Yet Significant'}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">p-value</div>
              <div className="text-sm font-semibold text-gray-900">{testResult.pValue}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Power</div>
              <div className="text-sm font-semibold text-gray-900">{testResult.power}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Effect</div>
              <div className="text-sm font-semibold text-gray-900">{testResult.effectSize}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalConfidence;
