/**
 * Widget Generation Service
 * Generate interactive charts via Claude
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5176';

export async function generateWidget(prompt, options = {}) {
  const response = await fetch(`${API_BASE}/api/widget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      company: options.company,
      data: options.data
    })
  });
  
  if (!response.ok) {
    throw new Error(`Widget generation failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function generatePPT(options) {
  const response = await fetch(`${API_BASE}/api/ppt/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  });
  
  if (!response.ok) {
    throw new Error(`PPT generation failed: ${response.statusText}`);
  }
  
  // Return blob for download
  return response.blob();
}

export async function previewPPT(options) {
  const response = await fetch(`${API_BASE}/api/ppt/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  });
  
  if (!response.ok) {
    throw new Error(`PPT preview failed: ${response.statusText}`);
  }
  
  return response.json();
}

export function downloadPPT(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'presentation.pptx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
