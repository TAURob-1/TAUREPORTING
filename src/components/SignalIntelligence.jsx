import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import MetricCard from './MetricCard';
import { signalData } from '../data/signalData';

function SignalIntelligence() {
  const { traffic, seo, competitive, aiReadiness, spend, insights, summary } = signalData;

  // Prepare data for market share pie chart
  const marketShareData = Object.entries(traffic.marketShare).map(([key, data]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    value: data.visits,
    share: data.share
  }));

  const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6'];

  // Prepare competitor comparison data
  const competitorData = competitive.competitors.map(comp => ({
    name: comp.name,
    traffic: comp.traffic / 1000, // Convert to thousands
    aiVisible: comp.aiVisible
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Signal Intelligence</h1>
              <p className="text-blue-100 mt-2">Real-time competitive intelligence powered by TAU Signal</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Data Source</div>
              <div className="text-xl font-bold">53 live feeds</div>
              <div className="text-xs text-blue-200 mt-1">Updated: Dec 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard
            title="Market Share"
            value="88.4%"
            subtext="Dominant leader"
            positive={true}
          />
          <MetricCard
            title="Monthly Visits"
            value="452K"
            subtext="+32.5% vs Nov"
            positive={true}
          />
          <MetricCard
            title="SEO Keywords"
            value="29,840"
            subtext="34 in top 10"
          />
          <MetricCard
            title="AI Visibility"
            value="0%"
            subtext="$340K opportunity"
            positive={false}
          />
          <MetricCard
            title="Ad Spend"
            value="$150K"
            subtext="High efficiency"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Market Share & Traffic */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Share Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Dominance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, share }) => `${name}: ${share}%`}
                    outerRadius={110}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value / 1000).toFixed(1)}K visits`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12.2x</div>
                <div className="text-xs text-gray-500">vs nearest competitor</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">88.4%</div>
                <div className="text-xs text-gray-500">market share</div>
              </div>
            </div>
          </div>

          {/* Traffic Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Growth Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={traffic.trend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} stroke="#e5e7eb" />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value) => `${(value / 1000).toFixed(0)}K visits`} />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 6, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
                    name="Monthly Visits"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Growth Rate</div>
                <div className="text-xl font-bold text-green-600">+32.5%</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Dec 2024</div>
                <div className="text-xl font-bold text-gray-900">452K visits</div>
              </div>
            </div>
          </div>

          {/* SEO Gap Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SEO Opportunity Gap</h3>
            <div className="space-y-4">
              {seo.opportunities.slice(0, 4).map((opp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{opp.keyword}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {opp.volume.toLocaleString()} monthly searches • {opp.difficulty} difficulty
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {opp.currentRank ? (
                      <div className="text-sm">
                        <span className="text-gray-500">Rank:</span>
                        <span className={`font-bold ml-1 ${
                          opp.currentRank <= 10 ? 'text-green-600' : 
                          opp.currentRank <= 20 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          #{opp.currentRank}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Not Ranking
                      </span>
                    )}
                    {opp.gap && (
                      <div className="text-xs text-orange-600 mt-1">⚠️ Gap</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{seo.highVolumeGaps}</div>
                  <div className="text-sm text-gray-600">High-volume gaps</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{seo.totalKeywords.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total keywords</div>
                </div>
              </div>
            </div>
          </div>

          {/* Spend Efficiency Comparison */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Competitive Spend Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spend.competitive} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} stroke="#e5e7eb" />
                  <YAxis yAxisId="left" orientation="left" stroke="#e5e7eb" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#e5e7eb" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="spend" fill="#2563eb" name="Spend ($K)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="traffic" fill="#10b981" name="Traffic (K)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">CarShield CPA</div>
                <div className="text-xl font-bold text-blue-600">$42-$58</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">Efficiency Score</div>
                <div className="text-xl font-bold text-green-600">100/100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Readiness & Insights */}
        <div className="space-y-6">
          {/* AI Readiness Scorecard */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Visibility Score</h3>
            
            {/* CarShield Score */}
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="text-center">
                <div className="text-5xl font-bold text-red-600 mb-2">{aiReadiness.carshield.score}%</div>
                <div className="text-sm font-semibold text-red-800">CarShield</div>
                <div className="text-xs text-red-600 mt-1">{aiReadiness.carshield.status}</div>
              </div>
            </div>

            {/* Competitor Scores */}
            <div className="space-y-3 mb-6">
              {aiReadiness.competitors.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{comp.name}</div>
                    <div className="text-xs text-gray-500">{comp.citations} citations</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: comp.color }}>
                      {comp.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Opportunity Highlight */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <div className="text-xs font-semibold text-purple-900 mb-2">Opportunity</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {aiReadiness.potential.monthlyValue}
              </div>
              <div className="text-xs text-gray-700">
                Est. monthly value from AI visibility
              </div>
              <div className="text-xs text-purple-600 mt-2">
                +{aiReadiness.potential.newVisits.toLocaleString()} visits/month
              </div>
            </div>
          </div>

          {/* AI Channel Priorities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Channel Strategy</h3>
            <div className="space-y-3">
              {aiReadiness.opportunities.map((opp, idx) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900">{opp.channel}</div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      P{opp.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{opp.description}</div>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      opp.impact === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {opp.impact} Impact
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      opp.effort === 'Low' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {opp.effort} Effort
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div key={idx} className="border-l-4 pl-4 py-2" style={{
                  borderColor: insight.urgency === 'High' ? '#dc2626' : 
                               insight.urgency === 'Medium' ? '#f59e0b' : '#10b981'
                }}>
                  <div className="text-xs font-semibold text-gray-500 mb-1">{insight.category}</div>
                  <div className="text-sm text-gray-700">{insight.insight}</div>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      insight.impact === 'Critical' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {insight.impact} Impact
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      insight.urgency === 'High' ? 'bg-red-100 text-red-800' :
                      insight.urgency === 'Medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.urgency} Urgency
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Strengths & Weaknesses */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SWOT Summary</h3>
            
            <div className="mb-4">
              <div className="text-sm font-semibold text-green-700 mb-2">✅ Strengths</div>
              <div className="space-y-2">
                {competitive.strengths.map((strength, idx) => (
                  <div key={idx} className="text-xs text-gray-700 flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-orange-700 mb-2">⚠️ Opportunities</div>
              <div className="space-y-2">
                {competitive.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="text-xs text-gray-700 flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    <span>{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 text-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-900">TAU Signal Intelligence</div>
              <div className="text-xs text-blue-800 mt-1">
                Real competitive data harvested from 53 live sources. Updated daily.
                Next refresh: 6 hours. Priority recommendation: <strong>AI Visibility Strategy</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignalIntelligence;
