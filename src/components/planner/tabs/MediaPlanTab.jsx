import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

    // Simple markdown-to-HTML conversion for print
    const htmlContent = state.mediaPlan.markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '<br/><br/>');

    printWindow.document.write(`
      <html>
        <head>
          <title>Media Plan Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; line-height: 1.6; max-width: 800px; }
            h1 { font-size: 24px; border-bottom: 2px solid #1d4ed8; padding-bottom: 8px; }
            h2 { font-size: 20px; margin-top: 24px; color: #1e40af; }
            h3 { font-size: 16px; margin-top: 16px; }
            ul { padding-left: 20px; }
            li { margin: 4px 0; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-size: 13px; }
            th { background: #f3f4f6; font-weight: 600; }
          </style>
        </head>
        <body>
          ${htmlContent}
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
            <div className="prose dark:prose-invert max-w-none prose-table:text-sm prose-td:px-3 prose-td:py-1.5 prose-th:px-3 prose-th:py-1.5 prose-headings:text-gray-900 dark:prose-headings:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{state.mediaPlan.markdown}</ReactMarkdown>
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
