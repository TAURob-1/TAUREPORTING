import React, { useState } from 'react';
import { PLANNER_TABS } from '../../config/plannerConfig';
import PlannerHeader from './PlannerHeader';
import ChatTab from './tabs/ChatTab';
import MediaPlanTab from './tabs/MediaPlanTab';
import SystemPromptTab from './tabs/SystemPromptTab';
import DataSourcesMenu from './DataSourcesMenu';

export default function PlannerWorkspace() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showDataSources, setShowDataSources] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-4">
      <PlannerHeader />

      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800">
        <div className="flex space-x-1">
          {PLANNER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowDataSources((prev) => !prev)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          📊 Data Sources
        </button>
      </div>

      {showDataSources && <DataSourcesMenu onClose={() => setShowDataSources(false)} />}

      <div className="min-h-[500px]">
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'plan' && <MediaPlanTab />}
        {activeTab === 'prompt' && <SystemPromptTab />}
      </div>
    </div>
  );
}
