import React, { useEffect, useRef, useState } from 'react';
import { generateVoiceResponse } from '../../services/widgetService';

const PROMPTS = [
  'What is the sharpest competitive story here?',
  'Which risks matter most in the next quarter?',
  'What would I say to the board about this brand?',
];

function chooseMimeType() {
  if (!window.MediaRecorder) {
    return '';
  }
  const options = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav'];
  return options.find((item) => MediaRecorder.isTypeSupported(item)) || '';
}

function chooseBritishVoice() {
  if (!window.speechSynthesis) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => /en-gb|english.*uk|british/i.test(`${voice.lang} ${voice.name}`)) || voices[0] || null;
}

export default function SignalVoiceStudio({ companySlug, companyName }) {
  const [status, setStatus] = useState('Ready to record');
  const [meta, setMeta] = useState('Click once to record. Click again to send.');
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [matchedCompanies, setMatchedCompanies] = useState([]);
  const [error, setError] = useState('');
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  async function speakFallback(text) {
    if (!window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = chooseBritishVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function playPayload(payload) {
    if (payload.browser_tts_fallback) {
      await speakFallback(payload.answer);
      return;
    }

    const audio = new Audio(`data:${payload.audio_mime_type};base64,${payload.audio_base64}`);
    audioRef.current = audio;
    await audio.play();
  }

  async function sendAudio(blob) {
    setBusy(true);
    setError('');
    setStatus('Thinking...');
    setMeta('Signal is transcribing, matching companies, and generating the response.');

    try {
      const payload = await generateVoiceResponse(blob, {
        companySlug,
        maxCompanies: 3,
      });

      setTranscript(payload.transcript || '');
      setAnswer(payload.answer || '');
      setMatchedCompanies(payload.matched_companies || []);
      setStatus(payload.tts_provider === 'elevenlabs' ? 'Speaking...' : 'Answer ready');
      setMeta(
        payload.browser_tts_fallback
          ? 'Browser voice fallback used.'
          : `Audio rendered via ${payload.tts_provider}.`
      );
      await playPayload(payload);
    } catch (requestError) {
      setError(requestError.message || 'Voice request failed');
      setStatus('Voice request failed');
      setMeta('Check the Reporting proxy and Signal API availability.');
    } finally {
      setBusy(false);
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('This browser does not support audio recording.');
      return;
    }

    setError('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];

    const mimeType = chooseMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setRecording(false);
      await sendAudio(blob);
    };

    recorder.start();
    setRecording(true);
    setStatus('Recording...');
    setMeta(`Ask about ${companyName || 'the selected company'}, then click again to send.`);
  }

  async function handleRecordToggle() {
    if (busy) {
      return;
    }
    if (!recording) {
      await startRecording();
      return;
    }
    recorderRef.current?.stop();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-600 font-semibold">Voice</p>
          <h3 className="text-lg font-bold text-gray-900">Signal Voice Studio</h3>
          <p className="text-sm text-gray-600 mt-1">Live microphone input, Signal company matching, spoken answer.</p>
        </div>
        <button
          type="button"
          onClick={handleRecordToggle}
          disabled={busy}
          className={`px-4 py-3 rounded-full text-sm font-semibold transition ${
            recording
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          } ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {recording ? 'Stop & Send' : busy ? 'Working...' : 'Record Question'}
        </button>
      </div>

      <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
        <div className="text-sm font-semibold text-cyan-900">{status}</div>
        <div className="text-sm text-cyan-800 mt-1">{meta}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((prompt) => (
          <span
            key={prompt}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
          >
            {prompt}
          </span>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold">Transcript</div>
          <p className="text-sm text-slate-700 mt-2 min-h-[96px]">{transcript || 'No transcript yet.'}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold">Signal answer</div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {matchedCompanies.map((company) => (
                <span key={company.slug} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold">
                  {company.name}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-700 mt-2 min-h-[96px]">{answer || 'The spoken answer will appear here.'}</p>
        </div>
      </div>
    </div>
  );
}
