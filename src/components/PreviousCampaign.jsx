import React from 'react';

const PreviousCampaign = ({ campaign }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Previous Test</h2>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">{campaign.period}</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Campaign</span>
          <span className="font-semibold text-sm">{campaign.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Measured Lift</span>
          <span className="font-bold text-lg text-emerald-300">{campaign.lift}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">iROAS</span>
          <span className="font-bold text-lg">{campaign.iROAS}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Test Design</span>
          <span className="font-semibold text-sm">{campaign.testDesign}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/15">
        <div className="text-[10px] text-blue-300 uppercase tracking-wider font-medium">Key Learning</div>
        <div className="text-sm mt-1 text-blue-50 leading-relaxed">{campaign.keyLearning}</div>
      </div>
    </div>
  );
};

export default PreviousCampaign;
