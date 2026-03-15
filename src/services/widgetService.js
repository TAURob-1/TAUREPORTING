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

export async function generateVoiceResponse(audioBlob, options = {}) {
  const formData = new FormData();
  const extension = audioBlob.type?.includes('mp4') ? 'm4a' : audioBlob.type?.includes('mpeg') ? 'mp3' : audioBlob.type?.includes('wav') ? 'wav' : 'webm';

  formData.append('audio', audioBlob, `signal-voice.${extension}`);
  if (options.companySlug) {
    formData.append('company_slug', options.companySlug);
  }
  if (options.maxCompanies) {
    formData.append('max_companies', String(options.maxCompanies));
  }

  const response = await fetch(`${API_BASE}/api/voice`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = `Voice request failed: ${response.statusText}`;
    try {
      const payload = await response.json();
      message = payload.detail || payload.error || message;
    } catch {
      // ignore parse failures
    }
    throw new Error(message);
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
