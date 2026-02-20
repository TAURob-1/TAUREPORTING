import React, { useEffect, useMemo, useState } from 'react';
import { usePlatform } from '../context/PlatformContext.jsx';
import {
  getCountryMarketContext,
  getMediaReachTable,
  getMediaDataQuality,
  getMediaIntelligenceSummary,
} from '../data/marketData';
import { loadSignalMediaData } from '../lib/media/signalDataLoader';

function toNumber(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  return cleaned ? Number(cleaned) : 0;
}

function formatMillions(value) {
  if (!value || Number.isNaN(value)) return '0.0M HH';
  return `${value.toFixed(1)}M HH`;
}

function deriveHouseholdReach(row, households) {
  if (String(row.reach).includes('HH')) {
    return row.reach;
  }

  const pct = toNumber(row.reachPct);
  if (!pct || !households) return 'n/a';

  const hhMillions = (households * (pct / 100)) / 1000000;
  return formatMillions(hhMillions);
}

function MediaReach() {
  const { countryCode } = usePlatform();
  const [signalMedia, setSignalMedia] = useState({
    channels: [],
    ctv: [],
    radio: [],
    hasSignalData: false,
    source: 'Loading...',
  });

  useEffect(() => {
    let mounted = true;
    loadSignalMediaData().then((data) => {
      if (!mounted) return;
      setSignalMedia(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const marketContext = useMemo(() => getCountryMarketContext(countryCode), [countryCode]);
  const mediaReach = useMemo(() => getMediaReachTable(countryCode), [countryCode]);
  const dataQuality = useMemo(() => getMediaDataQuality(countryCode), [countryCode]);
  const intelligenceSummary = useMemo(() => getMediaIntelligenceSummary(countryCode), [countryCode]);

  const rows = useMemo(() => {
    return mediaReach.rows.map((row) => ({
      ...row,
      householdReach: deriveHouseholdReach(row, marketContext.households),
      reachValue: toNumber(row.reachPct),
    }));
  }, [mediaReach.rows, marketContext.households]);

  const topPlatform = rows.reduce((best, row) => {
    if (!best || row.reachValue > best.reachValue) return row;
    return best;
  }, null);

  const avgReach = rows.length
    ? rows.reduce((sum, row) => sum + row.reachValue, 0) / rows.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <section className="rounded-2xl p-6 md:p-8 mb-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 relative overflow-hidden">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Media Platform Reach</h1>
            <p className="mt-2 text-sm text-slate-200">
              {mediaReach.subtitle} for {marketContext.marketLabel}. Household-normalized planning view with key demographic fit.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="px-2 py-1 rounded-full border border-slate-500/60 bg-slate-800/30">
                Data QA: {dataQuality.grade} ({dataQuality.passed}/{dataQuality.total})
              </span>
              {intelligenceSummary.generatedAt && (
                <span className="px-2 py-1 rounded-full border border-slate-500/60 bg-slate-800/30">
                  Signal refresh: {intelligenceSummary.generatedAt.slice(0, 10)}
                </span>
              )}
              <span className="px-2 py-1 rounded-full border border-slate-500/60 bg-slate-800/30">
                Signal media: {signalMedia.channels.length + signalMedia.ctv.length + signalMedia.radio.length} records
              </span>
            </div>
          </div>
        </section>

        {intelligenceSummary.keyMetrics && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Top Broadcaster</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{intelligenceSummary.keyMetrics.top_broadcaster}</div>
              <div className="text-xs text-slate-500 mt-1">{intelligenceSummary.keyMetrics.broadcaster_share}% viewing share</div>
            </article>
            <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Top Streaming Service</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{intelligenceSummary.keyMetrics.top_svod}</div>
              <div className="text-xs text-slate-500 mt-1">{intelligenceSummary.keyMetrics.streaming_share}% streaming share</div>
            </article>
            <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Top Video Platform</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{intelligenceSummary.keyMetrics.top_video_platform}</div>
              <div className="text-xs text-slate-500 mt-1">{intelligenceSummary.keyMetrics.video_sharing_share}% video-sharing share</div>
            </article>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-slate-900">{(marketContext.households / 1000000).toFixed(1)}M</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Household Universe</div>
            <div className="text-xs text-slate-400 mt-1">{marketContext.marketLabel}</div>
          </article>
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-slate-900">{topPlatform?.platform || 'n/a'}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Top Platform</div>
            <div className="text-xs text-slate-400 mt-1">
              {topPlatform?.householdReach || 'n/a'} • {topPlatform?.reachPct || 'n/a'}
            </div>
          </article>
          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="text-2xl font-bold text-slate-900">{avgReach.toFixed(1)}%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Average Platform Reach</div>
            <div className="text-xs text-slate-400 mt-1">Across {rows.length} listed platforms</div>
          </article>
        </section>

        {intelligenceSummary.highlights?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Signal Highlights</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {intelligenceSummary.highlights.map((item) => (
                <div key={item} className="text-sm text-slate-700 bg-slate-50 rounded-lg border border-slate-100 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-slate-50">
            <h2 className="text-sm md:text-base font-bold text-slate-800">{mediaReach.title}</h2>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              Source: {countryCode === 'UK' ? 'BARB 4-Screen' : 'Nielsen Total Audience'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-gray-200">
                  <th className="py-3 px-5">Platform</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Household Reach</th>
                  <th className="py-3 px-4">Reach %</th>
                  <th className="py-3 px-4">Key Demographics</th>
                  <th className="py-3 px-5">Source</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={`${row.platform}-${row.channel}`}
                    className={`border-b border-gray-100 last:border-0 ${idx === 0 ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-3 px-5 font-semibold text-slate-900 whitespace-nowrap">{row.platform}</td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{row.channel}</td>
                    <td className="py-3 px-4 text-slate-900 font-semibold whitespace-nowrap">{row.householdReach}</td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{row.reachPct}</td>
                    <td className="py-3 px-4 text-slate-700">{row.keyDemo}</td>
                    <td className="py-3 px-5 text-xs text-slate-500">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-4 text-[11px] text-slate-500">
          Source: {intelligenceSummary.source || (countryCode === 'UK' ? 'BARB references' : 'Nielsen references')}
        </section>
      </div>
    </div>
  );
}

export default MediaReach;
