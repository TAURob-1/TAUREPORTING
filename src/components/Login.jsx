import { useState } from 'react';

// Client brand configurations for branded login experience
const CLIENT_BRANDS = {
  midnite: {
    gradient: 'from-[#1a0533] to-[#6b21a8]',
    accent: '#7c3aed',
    accentHover: '#9333ea',
    logo: '🎮',
    tagline: 'Esports & Sports Betting Intelligence',
  },
  tombola: {
    gradient: 'from-[#c8102e] to-[#e63950]',
    accent: '#c8102e',
    accentHover: '#e63950',
    logo: '🎱',
    tagline: 'Bingo & Gaming Intelligence',
  },
  cinch: {
    gradient: 'from-[#1d1d1b] to-[#4a4a48]',
    accent: '#ff6b35',
    accentHover: '#ff8c5a',
    logo: '🚗',
    tagline: 'Automotive Marketplace Intelligence',
  },
  dayinsure: {
    gradient: 'from-[#0f4c81] to-[#1a6fb5]',
    accent: '#0f4c81',
    accentHover: '#1a6fb5',
    logo: '🚘',
    tagline: 'Temporary Insurance Intelligence',
  },
};

function detectBrand(username) {
  const u = username.toLowerCase();
  if (u.includes('midnite')) return 'midnite';
  if (u.includes('tombola')) return 'tombola';
  if (u.includes('cinch')) return 'cinch';
  if (u.includes('dayinsure') || u.includes('day insure')) return 'dayinsure';
  return null;
}

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const detectedBrand = detectBrand(username);
  const brand = CLIENT_BRANDS[detectedBrand] || null;

  // Dynamic gradient: client brand or TAU default
  const gradientClass = brand
    ? `bg-gradient-to-br ${brand.gradient}`
    : 'bg-gradient-to-br from-[#003366] to-[#3385d6]';

  const accentColor = brand?.accent || '#003366';
  const accentHover = brand?.accentHover || '#3385d6';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }

      onLoginSuccess(data.user);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${gradientClass} flex items-center justify-center px-4 transition-all duration-500`}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header band */}
          <div
            className="px-8 py-6 text-white text-center"
            style={{ backgroundColor: accentColor }}
          >
            {brand ? (
              <>
                <div className="text-4xl mb-2">{brand.logo}</div>
                <h1 className="text-2xl font-bold">TAU Reporting</h1>
                <p className="text-sm opacity-80 mt-1">{brand.tagline}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center mb-3">
                  <img src="/TAU_Logo.png" alt="TAU" className="h-10 w-10 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <h1 className="text-2xl font-bold">TAU Reporting</h1>
                <p className="text-sm opacity-80 mt-1">Campaign Intelligence Platform</p>
              </>
            )}
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                  style={{ '--tw-ring-color': accentColor }}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                  style={{ '--tw-ring-color': accentColor }}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: loading ? accentColor : accentColor }}
                onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = accentHover; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = accentColor; }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Credentials hint (collapsible feel) */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <details className="group">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors text-center select-none">
                  Demo credentials ▾
                </summary>
                <div className="mt-3 space-y-1 text-center">
                  {[
                    ['TAU', 'Demo2026'],
                    ['Tombola', 'Tombola2026'],
                    ['Cinch', 'Cinch2026'],
                    ['Dayinsure', 'Dayinsure2026'],
                    ['Midnite', 'Midnite2026'],
                  ].map(([u, p]) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => { setUsername(u); setPassword(p); setError(''); }}
                      className="inline-block mx-1 my-0.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono text-gray-600 transition-colors"
                    >
                      {u}
                    </button>
                  ))}
                  <p className="text-xs text-gray-400 mt-1">Click to autofill</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-4">
          Powered by TAU Signal Intelligence
        </p>
      </div>
    </div>
  );
}
