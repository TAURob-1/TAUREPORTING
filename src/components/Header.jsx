import React from 'react';

const Header = ({ testPeriod }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">CTV Incrementality Test Results</h1>
          <p className="text-emerald-100 mt-1 text-sm">Geographic Holdout Measurement Dashboard</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs text-emerald-200 uppercase tracking-wider font-medium">Test Period</div>
          <div className="text-lg font-semibold mt-0.5">{testPeriod.start} - {testPeriod.end}</div>
          <div className="flex items-center gap-1.5 mt-1 md:justify-end">
            <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-sm text-emerald-100 font-medium">{testPeriod.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
