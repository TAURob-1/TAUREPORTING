import React from 'react';

const MetricCard = ({ title, value, subtext, positive }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 metric-card border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</div>
      <div className={`text-2xl font-bold mt-1.5 ${
        positive === true ? 'text-emerald-600' :
        positive === false ? 'text-red-600' : 'text-gray-900'
      }`}>
        {value}
      </div>
      {subtext && (
        <div className={`text-xs mt-1 font-medium ${
          positive === true ? 'text-emerald-600' :
          positive === false ? 'text-red-500' : 'text-blue-600'
        }`}>
          {subtext}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
