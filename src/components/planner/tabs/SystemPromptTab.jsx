import React, { useEffect, useState } from 'react';
import { usePlanner } from '../../../context/PlannerContext';

export default function SystemPromptTab() {
  const { state, updateSystemPrompt, resetToDefaults } = usePlanner();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(state.systemPrompt);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(state.systemPrompt);
    }
  }, [isEditing, state.systemPrompt]);

  const handleSave = () => {
    updateSystemPrompt(editValue);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset to default 7-layer planning prompt?')) {
      resetToDefaults();
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Prompt</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditValue(state.systemPrompt);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Edit Prompt
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700"
              >
                Reset to Default
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          ⚠️ This prompt defines how the AI Planning Agent behaves. Changes affect all future planning conversations.
        </p>
      </div>

      {isEditing ? (
        <textarea
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          className="w-full h-[500px] px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-sm"
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-slate-200 font-mono">{state.systemPrompt}</pre>
        </div>
      )}
    </div>
  );
}
