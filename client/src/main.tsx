import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { RecoilRoot } from 'recoil';
import { Toaster } from './components/ui/sonner.tsx';

document.addEventListener('DOMContentLoaded', () => {
  const audioElement = document.getElementById('audio') as HTMLAudioElement;
  if (audioElement) {
    audioElement.volume = 0.02;
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <Analytics />
        <App />
        <Toaster />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
