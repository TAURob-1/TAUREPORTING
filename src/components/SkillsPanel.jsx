import { useState, useMemo } from 'react';
import { TAU_SKILLS, SKILL_CATEGORIES, getSkillsByCategory } from '../data/skillsData';

const CATEGORY_COLORS = {
  strategy: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  measurement: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  audience: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  commercial: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  ai: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  channel: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  framework: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
};

function SkillCard({ skill, onClick, isSelected }) {
  const colorClass = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.framework;
  return (
    <button
      onClick={() => onClick(skill)}
      className={`text-left w-full p-4 rounded-xl border transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{skill.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{skill.name}</h3>
            {skill.isPrimary && (
              <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Core</span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">{skill.shortDesc}</p>
          <span className={`mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
            {SKILL_CATEGORIES[skill.category]?.label || skill.category}
          </span>
        </div>
      </div>
    </button>
  );
}

function SkillDetail({ skill, onClose }) {
  if (!skill) return null;
  const colorClass = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.framework;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{skill.name}</h2>
                {skill.isPrimary && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Core Skill</span>
                )}
              </div>
              <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
                {SKILL_CATEGORIES[skill.category]?.label || skill.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors mt-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{skill.fullDesc}</p>

        {/* Frameworks */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Key Frameworks
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {skill.frameworks.map(f => (
              <span key={f} className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Use Cases
          </h4>
          <ul className="space-y-1">
            {skill.useCases.map(u => (
              <li key={u} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {u}
              </li>
            ))}
          </ul>
        </div>

        {/* Relevant Verticals */}
        {skill.relevantVerticals && !skill.relevantVerticals.includes('all') && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Best For
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skill.relevantVerticals.map(v => (
                <span key={v} className="text-xs px-2 py-0.5 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-full capitalize">
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* API hint */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-400 dark:text-slate-500 font-mono">
            API: GET /api/skills/{skill.id}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPanel() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(TAU_SKILLS.map(s => s.category))].sort();
    return ['all', ...cats];
  }, []);

  const filteredSkills = useMemo(() => {
    let skills = TAU_SKILLS;
    if (selectedCategory !== 'all') {
      skills = skills.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      skills = skills.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        s.fullDesc.toLowerCase().includes(q) ||
        s.useCases.some(u => u.toLowerCase().includes(q))
      );
    }
    return skills;
  }, [selectedCategory, searchQuery]);

  const handleSkillClick = (skill) => {
    setSelectedSkill(prev => prev?.id === skill.id ? null : skill);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">TAU Skills Library</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            {TAU_SKILLS.length} skills across {Object.keys(SKILL_CATEGORIES).length} categories
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {cat === 'all' ? `All (${TAU_SKILLS.length})` : (
              <>
                {SKILL_CATEGORIES[cat]?.icon} {SKILL_CATEGORIES[cat]?.label || cat}
                <span className="ml-1 opacity-70">({getSkillsByCategory(cat).length})</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className={`grid gap-4 ${selectedSkill ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {/* Skills grid */}
        <div className={`${selectedSkill ? 'lg:col-span-1' : 'sm:col-span-2 lg:col-span-3'}`}>
          {filteredSkills.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-slate-500">
              <p className="text-lg">No skills match your search</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-3 ${selectedSkill ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onClick={handleSkillClick}
                  isSelected={selectedSkill?.id === skill.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedSkill && (
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
            </div>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex flex-wrap gap-4 text-xs text-gray-400 dark:text-slate-500">
        {Object.entries(SKILL_CATEGORIES).map(([cat, info]) => {
          const count = getSkillsByCategory(cat).length;
          return count > 0 ? (
            <span key={cat}>{info.icon} {info.label}: {count}</span>
          ) : null;
        })}
      </div>
    </div>
  );
}
