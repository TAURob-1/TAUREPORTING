import React, { useState } from 'react';
import { ATTRIBUTE_CLASSES } from '../../data/audienceGraph/scores.js';

export default function AttributePicker({ selectedAttributes, onToggle }) {
  const [expandedClass, setExpandedClass] = useState(null);

  const isSelected = (classKey, attrKey) =>
    selectedAttributes.some((a) => a.classKey === classKey && a.attrKey === attrKey);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">Audience Attributes</h3>
      <div className="space-y-1">
        {Object.entries(ATTRIBUTE_CLASSES).map(([classKey, cls]) => {
          const isExpanded = expandedClass === classKey;
          const selectedCount = Object.keys(cls.attributes).filter((ak) => isSelected(classKey, ak)).length;

          return (
            <div key={classKey} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedClass(isExpanded ? null : classKey)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{cls.icon}</span>
                  <span className="text-gray-800 dark:text-slate-200">{cls.label}</span>
                  {selectedCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                      {selectedCount}
                    </span>
                  )}
                </span>
                <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                  {Object.entries(cls.attributes).map(([attrKey, attr]) => {
                    const active = isSelected(classKey, attrKey);
                    return (
                      <button
                        key={attrKey}
                        onClick={() => onToggle(classKey, attrKey)}
                        className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:border-blue-400'
                        }`}
                      >
                        {attr.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
