import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = document.getElementById('audio') as HTMLAudioElement;
    if (audioElement) {
      setAudio(audioElement);

      // Check if audio is already playing
      if (!audioElement.paused) {
        setIsPlaying(true);
      }

      // Add event listeners to keep UI in sync with actual audio state
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);

      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.muted = false;
      audio.volume = 0.02;
      audio.play().catch((error) => {
        console.error('Audio playback failed:', error);
      });
    }

    setIsPlaying(!isPlaying);
  };

  // Add keyboard shortcut for toggling audio
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if 'M' or 'm' key is pressed
      if (event.key === 'm' || event.key === 'M') {
        // Don't trigger shortcut if user is typing in an input field or textarea
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        ) {
          return;
        }
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [audio, isPlaying]); // Dependencies include audio and isPlaying

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary1 shadow-lg transition-all duration-200 hover:scale-105"
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
      title={isPlaying ? 'Mute music (M)' : 'Play music (M)'}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
};

export default AudioPlayer;
