import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Login from './components/Login.jsx';
import './index.css';
import { PlatformProvider } from './context/PlatformContext.jsx';
import { PlannerProvider } from './context/PlannerContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function AppWrapper() {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={login} />;
  }

  return (
    <PlatformProvider>
      <PlannerProvider>
        <App />
      </PlannerProvider>
    </PlatformProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </React.StrictMode>,
);
