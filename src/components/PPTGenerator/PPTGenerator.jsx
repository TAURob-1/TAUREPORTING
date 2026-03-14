/**
 * PPT Generator Component
 * Generate TAU-branded PowerPoint presentations
 */
import React, { useState } from 'react';
import { generatePPT, previewPPT, downloadPPT } from '../../services/widgetService';
import './PPTGenerator.css';

export default function PPTGenerator({ company = null }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  
  const handlePreview = async () => {
    if (!title.trim() || !prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await previewPPT({
        title,
        subtitle,
        prompt,
        company
      });
      setPreview(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const blob = await generatePPT({
        title,
        subtitle,
        prompt,
        company,
        slides: preview?.slides
      });
      
      const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pptx`;
      downloadPPT(blob, filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="ppt-generator">
      <div className="ppt-header">
        <h3>📊 PowerPoint Generator</h3>
        <p>Generate TAU-branded presentations with AI</p>
      </div>
      
      <div className="ppt-form">
        <div className="form-group">
          <label>Presentation Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Q1 2026 Market Analysis"
          />
        </div>
        
        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g., Competitive Intelligence Report"
          />
        </div>
        
        <div className="form-group">
          <label>Content Prompt *</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what the presentation should cover..."
            rows={4}
          />
        </div>
        
        <div className="ppt-actions">
          <button 
            onClick={handlePreview} 
            disabled={loading || !title.trim() || !prompt.trim()}
            className="preview-btn"
          >
            {loading ? 'Generating...' : '👁️ Preview Slides'}
          </button>
          
          {preview && (
            <button 
              onClick={handleDownload}
              disabled={loading}
              className="download-btn"
            >
              ⬇️ Download PPTX
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="ppt-error">⚠️ {error}</div>
      )}
      
      {preview && (
        <div className="ppt-preview">
          <h4>Preview ({preview.slide_count} slides)</h4>
          
          <div className="preview-slides">
            <div className="preview-slide title-slide">
              <h2>{preview.title}</h2>
              {preview.subtitle && <p>{preview.subtitle}</p>}
              <span className="slide-number">1</span>
            </div>
            
            {preview.slides?.map((slide, idx) => (
              <div key={idx} className="preview-slide">
                <h3>{slide.title}</h3>
                <ul>
                  {slide.bullets?.map((bullet, bidx) => (
                    <li key={bidx}>{bullet}</li>
                  ))}
                </ul>
                <span className="slide-number">{idx + 2}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
