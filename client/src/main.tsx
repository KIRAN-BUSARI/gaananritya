import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { RecoilRoot } from 'recoil';
import { Toaster } from './components/ui/sonner.tsx';
import { SpeedInsights } from '@vercel/speed-insights/react';

// More aggressive audio autoplay approach
const setupAudioAutoplay = () => {
  const audioElement = document.getElementById('audio') as HTMLAudioElement;
  if (!audioElement) return;

  audioElement.volume = 0.001;
  audioElement.muted = true;
  audioElement.loop = true;

  const attemptPlay = () => {
    Promise.all([
      audioElement.play().catch(() => {}),
      new Promise((resolve) =>
        setTimeout(() => {
          audioElement.play().catch(() => {});
          resolve(true);
        }, 100),
      ),
      new Promise((resolve) =>
        setTimeout(() => {
          audioElement.play().catch(() => {});
          resolve(true);
        }, 500),
      ),
    ])
      .then(() => {
        setTimeout(() => {
          audioElement.muted = false;
          const fadeIn = setInterval(() => {
            if (audioElement.volume < 0.1) {
              audioElement.volume += 0.01;
            } else {
              clearInterval(fadeIn);
            }
          }, 100);
        }, 1000);
      })
      .catch(() => {
        console.log('Autoplay prevented by browser policy');
      });
  };

  attemptPlay();
  window.addEventListener('load', attemptPlay);
  document.addEventListener('DOMContentLoaded', attemptPlay);

  const enableAudio = () => {
    audioElement.muted = false;
    audioElement.volume = 0.1;
    audioElement
      .play()
      .catch((e) => console.log('Still cannot play audio:', e));

    // Remove listeners after first interaction
    ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'].forEach(
      (event) => {
        document.removeEventListener(event, enableAudio);
      },
    );
  };

  // Add multiple event listeners to detect any user interaction
  ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'].forEach((event) => {
    document.addEventListener(event, enableAudio);
  });
};

// Run audio setup both immediately and after DOM is loaded
setupAudioAutoplay();
document.addEventListener('DOMContentLoaded', setupAudioAutoplay);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <Analytics />
        <SpeedInsights />
        <App />
        <Toaster />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
