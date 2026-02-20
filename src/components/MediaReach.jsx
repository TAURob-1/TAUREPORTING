import React, { useEffect, useMemo, useState } from 'react';
import { usePlatform } from '../context/PlatformContext.jsx';
import {
  getCountryMarketContext,
  getMediaDataQuality,
  getMediaIntelligenceSummary,
} from '../data/marketData';
import { loadSignalMediaData } from '../lib/media/signalDataLoader';
import { MAJOR_MEDIA_PLATFORMS } from '../lib/data/mediaPlatforms';
import { ENRICHED_PUBLISHERS } from '../lib/data/publisherData';
import { CONTENT_CATEGORY_INSIGHTS } from '../lib/data/contentCategories';
import { AGE_PREFERENCES, GENDER_PREFERENCES, INCOME_PREFERENCES } from '../lib/data/audiencePreferences';
import { getAudienceMediaRecommendations } from '../lib/campaign/smartDefaults';
import PlatformTable from './media/PlatformTable';
import PublisherTable from './media/PublisherTable';
import ContentInsights from './media/ContentInsights';
import AudiencePreferences from './media/AudiencePreferences';
import RecommendationsPanel from './media/RecommendationsPanel';

function MediaReach() {
  const { countryCode, audienceStrategy } = usePlatform();
  const marketContext = useMemo(() => getCountryMarketContext(countryCode), [countryCode]);
  const dataQuality = useMemo(() => getMediaDataQuality(countryCode), [countryCode]);
  const intelligenceSummary = useMemo(() => getMediaIntelligenceSummary(countryCode), [countryCode]);
  const recommendations = useMemo(
    () => getAudienceMediaRecommendations(audienceStrategy.primaryAudience),
    [audienceStrategy.primaryAudience]
  );

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

  const signalSummary = {
    channels: signalMedia.channels.length,
    ctv: signalMedia.ctv.length,
    radio: signalMedia.radio.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 relative overflow-hidden">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Media Reach Intelligence</h1>
            <p className="mt-2 text-sm text-slate-200">
              Multi-platform media landscape for {marketContext.marketLabel} with programming and audience preference insights.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="px-2 py-1 rounded-full border border-slate-500/60 bg-slate-800/30">
                Data QA: {dataQuality.grade} ({dataQuality.passed}/{dataQuality.total})
              </span>
              <span className="px-2 py-1 rounded-full border border-slate-500/60 bg-slate-800/30">
                Signal Media Source: {signalMedia.source}
              </span>
              {intelligenceSummary.generatedAt && (
                <span className="px-2 py-1 rounded-full border border-slate-500/60 bg-slate-800/30">
                  Refresh: {intelligenceSummary.generatedAt.slice(0, 10)}
                </span>
              )}
            </div>
          </div>
        </section>

        <RecommendationsPanel
          audienceName={audienceStrategy.primaryAudience}
          recommendations={recommendations}
        />

        <PlatformTable rows={MAJOR_MEDIA_PLATFORMS} />

        <PublisherTable rows={ENRICHED_PUBLISHERS} signalMediaSummary={signalSummary} />

        <ContentInsights rows={CONTENT_CATEGORY_INSIGHTS} />

        <AudiencePreferences
          ageRows={AGE_PREFERENCES}
          genderRows={GENDER_PREFERENCES}
          incomeRows={INCOME_PREFERENCES}
        />
      </div>
    </div>
  );
}

export default MediaReach;
