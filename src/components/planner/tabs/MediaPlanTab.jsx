import React from 'react';
import { usePlanner } from '../../../context/PlannerContext';

export default function MediaPlanTab() {
  const { state, updateMediaPlan } = usePlanner();
  const layerMatches = [...(state.mediaPlan.markdown || '').matchAll(/##\s*Layer\s*(\d+)/gi)];
  const includedLayers = [...new Set(layerMatches.map((match) => Number.parseInt(match[1], 10)).filter((layer) => layer >= 1 && layer <= 7))];

  const copyToClipboard = async () => {
    if (!state.mediaPlan.markdown) return;
    try {
      await navigator.clipboard.writeText(state.mediaPlan.markdown);
    } catch (error) {
      console.error('[MediaPlanTab] Clipboard copy failed:', error);
    }
  };

  const exportMarkdown = () => {
    if (!state.mediaPlan.markdown) return;
    const blob = new Blob([state.mediaPlan.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'media-plan.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!state.mediaPlan.markdown) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const escaped = state.mediaPlan.markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    printWindow.document.write(`
      <html>
        <head>
          <title>Media Plan Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            pre { white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Media Plan</h1>
          <pre>${escaped}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Media Plan</h3>
          {state.mediaPlan.lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-slate-400">
              Last updated: {new Date(state.mediaPlan.lastUpdated).toLocaleString()}
            </span>
          )}
          {includedLayers.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Layers included: {includedLayers.join(', ')}</p>
          )}
        </div>

        {state.mediaPlan.markdown && (
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Copy
            </button>
            <button
              onClick={exportMarkdown}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Export .md
            </button>
            <button
              onClick={exportPdf}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>

      {state.mediaPlan.markdown ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6">
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{state.mediaPlan.markdown}</pre>
            </div>
          </div>

          <textarea
            value={state.mediaPlan.markdown}
            onChange={(event) => updateMediaPlan(event.target.value)}
            className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-sm"
            placeholder="Media plan markdown will appear here..."
          />
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-12 text-center">
          <p className="text-gray-600 dark:text-slate-400">No media plan generated yet.</p>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">
            Start a planning conversation in the Chat tab. When the AI returns layer headers like "## Layer 1", the plan will auto-save here.
          </p>
        </div>
      )}
    </div>
  );
}
