import React from 'react';

function PreferenceTable({ title, columns, rows, rowKey }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-gray-200">
              {columns.map((column) => (
                <th key={column.key} className="py-3 px-4">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row[rowKey] || idx} className={`border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-slate-700">{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AudiencePreferences({ ageRows = [], genderRows = [], incomeRows = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <PreferenceTable
        title="Audience Preferences by Age"
        rowKey="ageGroup"
        rows={ageRows}
        columns={[
          { key: 'ageGroup', label: 'Age Group' },
          { key: 'platforms', label: 'Preferred Platforms' },
          { key: 'content', label: 'Preferred Content' },
          { key: 'habits', label: 'Viewing Habits' },
        ]}
      />
      <PreferenceTable
        title="Audience Preferences by Gender"
        rowKey="platform"
        rows={genderRows}
        columns={[
          { key: 'platform', label: 'Publisher/Platform' },
          { key: 'maleSkew', label: 'Male Skew' },
          { key: 'femaleSkew', label: 'Female Skew' },
          { key: 'notes', label: 'Notes' },
        ]}
      />
      <PreferenceTable
        title="Audience Preferences by Income"
        rowKey="platform"
        rows={incomeRows}
        columns={[
          { key: 'platform', label: 'Platform/Publisher' },
          { key: 'affluent', label: 'Affluent (£75K+)' },
          { key: 'mid', label: 'Mid (£30-75K)' },
          { key: 'mass', label: 'Mass (<£30K)' },
        ]}
      />
    </div>
  );
}
