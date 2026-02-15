# API Integration Guide

This guide shows how to connect the dashboard to real API endpoints.

## Current State

The dashboard currently uses mock data from `src/data/dashboardData.js`. This is perfect for:
- Demos and presentations
- UI development
- Testing layouts
- Client previews

## Integration Steps

### 1. Create API Service

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class DashboardAPI {
  async fetchDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  }

  async fetchDMADetails(dmaId) {
    const response = await fetch(`${API_BASE_URL}/dma/${dmaId}`);
    if (!response.ok) throw new Error('Failed to fetch DMA details');
    return response.json();
  }

  async fetchHistoricalData(startDate, endDate) {
    const response = await fetch(
      `${API_BASE_URL}/historical?start=${startDate}&end=${endDate}`
    );
    if (!response.ok) throw new Error('Failed to fetch historical data');
    return response.json();
  }
}

export default new DashboardAPI();
```

### 2. Create Custom Hooks

Create `src/hooks/useDashboardData.js`:

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.fetchDashboardData();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Optional: Set up polling for live data
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}
```

### 3. Update App Component

Update `src/App.jsx`:

```javascript
import React from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { dashboardData as mockData } from './data/dashboardData';
import Header from './components/Header';
// ... other imports

function App() {
  const { data, loading, error } = useDashboardData();
  
  // Fallback to mock data if API fails
  const dashboardData = data || mockData;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-900 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Rest of your dashboard */}
    </div>
  );
}
```

### 4. Expected API Response Format

Your API should return data matching this structure:

```json
{
  "testPeriod": {
    "start": "Jan 15, 2025",
    "end": "Feb 15, 2025",
    "status": "Live"
  },
  "metrics": {
    "totalImpressions": {
      "value": "24.8M",
      "change": "+12% vs target",
      "positive": true
    },
    "uniqueReach": {
      "value": "8.2M",
      "subtext": "Avg freq: 3.02x"
    },
    "measuredLift": {
      "value": "+22.4%",
      "subtext": "95% confidence",
      "positive": true
    },
    "iROAS": {
      "value": "$3.80",
      "subtext": "Above target ($2.50)",
      "positive": true
    }
  },
  "dmaRegions": [
    {
      "id": "LA",
      "name": "Los Angeles",
      "type": "high",
      "impressions": "2.4M",
      "lift": "+28.3%",
      "cx": 120,
      "cy": 280
    }
    // ... more DMAs
  ],
  "ctvProviders": [
    {
      "name": "Roku",
      "impressions": "8.2M",
      "share": 33,
      "lift": "+18%",
      "color": "#9333ea",
      "initial": "R"
    }
    // ... more providers
  ],
  "deliveryData": {
    "labels": ["Jan 15", "Jan 18", "Jan 21", ...],
    "exposed": [520, 680, 720, ...],
    "holdout": [340, 320, 350, ...]
  },
  "previousCampaign": {
    "name": "Summer Protection",
    "period": "Aug-Sep 2024",
    "lift": "+18.7%",
    "iROAS": "$2.95",
    "testDesign": "60/40 Geo Split",
    "keyLearning": "..."
  },
  "statisticalConfidence": {
    "exposedGroup": {
      "n": 45,
      "lift": "+22.4%",
      "confidence": 95,
      "interval": "+19.8% to +25.1%"
    },
    "holdoutGroup": {
      "n": 30,
      "lift": "-1.2%",
      "note": "Natural baseline variation (expected)"
    },
    "testResult": {
      "significant": true,
      "pValue": "0.003",
      "power": "94%",
      "effectSize": "Strong"
    }
  }
}
```

## Advanced Features

### Real-time Updates with WebSocket

```javascript
// src/services/websocket.js
class DashboardWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = new Set();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(data));
    };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export default new DashboardWebSocket('wss://api.example.com/dashboard');
```

### Caching with React Query

```bash
npm install @tanstack/react-query
```

```javascript
import { useQuery } from '@tanstack/react-query';

function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.fetchDashboardData(),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000 // Consider fresh for 30 seconds
  });
}
```

### Authentication

Add JWT token handling:

```javascript
// src/services/auth.js
export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

// Update api.js
async fetchDashboardData() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

## Testing API Integration

### 1. Mock API with JSON Server

```bash
npm install -D json-server
```

Create `db.json` with mock data, then:

```bash
npx json-server --watch db.json --port 3001
```

### 2. Use Environment Variables

```env
# .env.development
VITE_API_URL=http://localhost:3001/api

# .env.production
VITE_API_URL=https://api.carshield.com
```

### 3. Add Error Boundaries

```javascript
// src/components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## Checklist

Before going live:

✅ Test all API endpoints  
✅ Add loading states  
✅ Handle errors gracefully  
✅ Add retry logic  
✅ Implement authentication  
✅ Set up CORS properly  
✅ Add rate limiting  
✅ Test with slow network  
✅ Add error tracking (Sentry)  
✅ Monitor API performance  

---

**Ready to connect real data! 🔌**
