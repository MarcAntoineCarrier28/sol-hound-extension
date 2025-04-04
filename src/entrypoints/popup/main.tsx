import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/assets/tailwind.css';

// StrictMode causes double rendering which is good for development
// but can slow down the popup in production
const AppRoot = process.env.NODE_ENV === 'production' 
  ? <App /> 
  : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

ReactDOM.createRoot(document.getElementById('root')!).render(AppRoot);
