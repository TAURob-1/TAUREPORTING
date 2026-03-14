import React from 'react';
import { MECHANISMS, MECHANISM_KEYS } from '../../data/audienceGraph/scores.js';

function cellColor(W) {
  if (W >= 15) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
  if (W >= 8) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
  return 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400';
}

export default function ScoringMatrix({ rows, mechTotals, onScoreEdit, scoreOverrides = {} }) {
  if (!rows || rows.length === 0) return null;

  const handleEdit = (classKey, attrKey, mechKey, dim, currentVal) => {
    const newVal = window.prompt(`Edit ${dim} for ${classKey}.${attrKey} × ${mechKey}`, currentVal);
    if (newVal === null) return;
    const num = Number(newVal);
    if (Number.isNaN(num) || num < 0 || num > 5) return;
    onScoreEdit?.(`${classKey}.${attrKey}.${mechKey}.${dim}`, num);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-700">
            <th className="text-left px-2 py-1.5 text-gray-600 dark:text-slate-400 font-medium">Attribute</th>
            {MECHANISM_KEYS.map((mk) => (
              <th key={mk} className="px-2 py-1.5 text-center font-medium" style={{ color: MECHANISMS[mk].color }}>
                {MECHANISMS[mk].short}
              </th>
            ))}
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-800">
            <th className="text-left px-2 py-0.5 text-[10px] text-gray-400 dark:text-slate-500"></th>
            {MECHANISM_KEYS.map((mk) => (
              <th key={mk} className="px-2 py-0.5 text-center text-[10px] text-gray-400 dark:text-slate-500">P / S / W</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.classKey}.${row.attrKey}`} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
              <td className="px-2 py-1.5 font-medium text-gray-800 dark:text-slate-200 whitespace-nowrap">
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mr-1">{row.classLabel}</span>
                {row.label}
              </td>
              {MECHANISM_KEYS.map((mk) => {
                const { P, S, W } = row.scores[mk];
                return (
                  <td key={mk} className={`px-2 py-1.5 text-center whitespace-nowrap ${cellColor(W)}`}>
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => handleEdit(row.classKey, row.attrKey, mk, 'P', P)}
                    >{P}</span>
                    {' / '}
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => handleEdit(row.classKey, row.attrKey, mk, 'S', S)}
                    >{S}</span>
                    {' / '}
                    <span className="font-semibold">{W}</span>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-t-2 border-gray-300 dark:border-slate-600 font-semibold">
            <td className="px-2 py-1.5 text-gray-800 dark:text-slate-200">Totals</td>
            {MECHANISM_KEYS.map((mk) => (
              <td key={mk} className="px-2 py-1.5 text-center text-gray-800 dark:text-slate-200">
                {mechTotals[mk]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
