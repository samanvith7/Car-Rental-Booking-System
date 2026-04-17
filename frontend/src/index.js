import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#16161f',
            color: '#f8f9fa',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#16161f' } },
          error: { iconTheme: { primary: '#e63946', secondary: '#16161f' } },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
