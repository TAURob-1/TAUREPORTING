import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PlatformProvider } from './context/PlatformContext.jsx';
import { PlannerProvider } from './context/PlannerContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PlatformProvider>
      <PlannerProvider>
        <App />
      </PlannerProvider>
    </PlatformProvider>
  </React.StrictMode>,
);
