import React from 'react';
import Header from './Header';
import MetricCard from './MetricCard';
import USAMap from './USAMap';
import DeliveryChart from './DeliveryChart';
import CTVProviders from './CTVProviders';
import PreviousCampaign from './PreviousCampaign';
import StatisticalConfidence from './StatisticalConfidence';
import { dashboardData } from '../data/dashboardData';

function CampaignResults() {
  const { 
    testPeriod, 
    metrics, 
    dmaRegions, 
    ctvProviders, 
    deliveryData, 
    previousCampaign, 
    statisticalConfidence 
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Header testPeriod={testPeriod} />
      </div>

      {/* Campaign Health Indicator */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className={`rounded-lg p-4 border flex items-center gap-3 ${
          statisticalConfidence.testResult.significant
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            statisticalConfidence.testResult.significant ? 'bg-green-500' : 'bg-amber-500'
          }`} />
          <div className="flex-1">
            <span className={`text-sm font-semibold ${
              statisticalConfidence.testResult.significant ? 'text-green-800' : 'text-amber-800'
            }`}>
              Campaign Health: {statisticalConfidence.testResult.significant ? 'On Target' : 'Monitoring'}
            </span>
            <span className="text-xs text-gray-600 ml-3">
              Lift {metrics.measuredLift.value} at {metrics.measuredLift.subtext} | iROAS {metrics.iROAS.value} ({metrics.iROAS.subtext})
            </span>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            statisticalConfidence.testResult.significant
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {statisticalConfidence.testResult.significant ? 'Significant' : 'Pending'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map and Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Impressions"
              value={metrics.totalImpressions.value}
              subtext={metrics.totalImpressions.change}
              positive={metrics.totalImpressions.positive}
            />
            <MetricCard
              title="Unique Reach"
              value={metrics.uniqueReach.value}
              subtext={metrics.uniqueReach.subtext}
            />
            <MetricCard
              title="Measured Lift"
              value={metrics.measuredLift.value}
              subtext={metrics.measuredLift.subtext}
              positive={metrics.measuredLift.positive}
            />
            <MetricCard
              title="Est. iROAS"
              value={metrics.iROAS.value}
              subtext={metrics.iROAS.subtext}
              positive={metrics.iROAS.positive}
            />
          </div>

          {/* Interactive Map */}
          <USAMap dmaRegions={dmaRegions} />

          {/* Delivery Performance Chart */}
          <DeliveryChart deliveryData={deliveryData} />
        </div>

        {/* Right Column - Providers and Results */}
        <div className="space-y-6">
          {/* CTV Providers */}
          <CTVProviders providers={ctvProviders} />

          {/* Previous Campaign Results */}
          <PreviousCampaign campaign={previousCampaign} />

          {/* Statistical Confidence */}
          <StatisticalConfidence confidence={statisticalConfidence} />
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Sample data for demonstration. Production dashboard connects to live campaign APIs.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignResults;
