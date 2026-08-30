"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BackgroundMusicContextValue = {
  masterVolume: number;
  musicVolume: number;
  muteInBackground: boolean;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setMuteInBackground: (muted: boolean) => void;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(null);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [masterVolume, setMasterVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(65);
  const [muteInBackground, setMuteInBackground] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startMusic = () => {
      void audio.play().catch(() => {
        // Browsers may defer audible playback until the visitor interacts.
      });
    };

    const unlockMusic = () => {
      startMusic();
      window.removeEventListener("pointerdown", unlockMusic);
      window.removeEventListener("keydown", unlockMusic);
    };

    startMusic();
    window.addEventListener("pointerdown", unlockMusic);
    window.addEventListener("keydown", unlockMusic);

    return () => {
      window.removeEventListener("pointerdown", unlockMusic);
      window.removeEventListener("keydown", unlockMusic);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (masterVolume / 100) * (musicVolume / 100);
    }
  }, [masterVolume, musicVolume]);

  useEffect(() => {
    const syncBackgroundMute = () => {
      if (audioRef.current) {
        audioRef.current.muted = muteInBackground && document.hidden;
      }
    };

    syncBackgroundMute();
    document.addEventListener("visibilitychange", syncBackgroundMute);
    return () => document.removeEventListener("visibilitychange", syncBackgroundMute);
  }, [muteInBackground]);

  return (
    <BackgroundMusicContext.Provider
      value={{
        masterVolume,
        musicVolume,
        muteInBackground,
        setMasterVolume,
        setMusicVolume,
        setMuteInBackground,
      }}
    >
      <audio ref={audioRef} autoPlay loop preload="auto" aria-hidden="true">
        <source src="/audio/drag-and-dread.opus" type="audio/ogg; codecs=opus" />
      </audio>
      {children}
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error("useBackgroundMusic must be used within BackgroundMusicProvider");
  }
  return context;
}
