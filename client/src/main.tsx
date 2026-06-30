import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error("❌ Critical Error: VITE_GOOGLE_CLIENT_ID is missing from your frontend .env file!");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);