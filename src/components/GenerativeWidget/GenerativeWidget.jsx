/**
 * GenerativeWidget Component
 * Renders AI-generated interactive charts
 */
import React, { useState, useRef, useEffect } from 'react';
import { generateWidget } from '../../services/widgetService';
import './GenerativeWidget.css';

export default function GenerativeWidget({ 
  initialPrompt = '',
  company = null,
  data = null,
  onGenerated = null 
}) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetHtml, setWidgetHtml] = useState('');
  const [title, setTitle] = useState('');
  const containerRef = useRef(null);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateWidget(prompt, { company, data });
      setWidgetHtml(result.widget_html);
      setTitle(result.title);
      
      if (onGenerated) {
        onGenerated(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Render HTML safely in iframe
  useEffect(() => {
    if (widgetHtml && containerRef.current) {
      const iframe = containerRef.current.querySelector('iframe');
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: white;
              }
            </style>
          </head>
          <body>${widgetHtml}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [widgetHtml]);
  
  return (
    <div className="generative-widget">
      <div className="widget-input-area">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the chart you want (e.g., 'Show market share as a pie chart')"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          disabled={loading}
        />
        <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? 'Generating...' : '✨ Generate Chart'}
        </button>
      </div>
      
      {error && (
        <div className="widget-error">
          ⚠️ {error}
        </div>
      )}
      
      {widgetHtml && (
        <div className="widget-container" ref={containerRef}>
          <div className="widget-header">
            <span className="widget-title">{title}</span>
            <button 
              className="widget-expand"
              onClick={() => {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head><title>${title}</title></head>
                  <body style="margin:0;padding:20px;">${widgetHtml}</body>
                  </html>
                `);
              }}
            >
              ⛶ Expand
            </button>
          </div>
          <iframe 
            title={title}
            sandbox="allow-scripts allow-same-origin"
            style={{ width: '100%', height: '400px', border: 'none' }}
          />
        </div>
      )}
      
      {!widgetHtml && !loading && (
        <div className="widget-placeholder">
          <div className="placeholder-icon">📊</div>
          <p>Enter a prompt to generate an interactive chart</p>
          <div className="placeholder-examples">
            <strong>Try:</strong>
            <button onClick={() => setPrompt('Create a bar chart comparing Q1 vs Q2 revenue')}>
              Bar chart
            </button>
            <button onClick={() => setPrompt('Show website traffic as a line chart over 12 months')}>
              Line chart
            </button>
            <button onClick={() => setPrompt('Display market share as a donut chart')}>
              Donut chart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
