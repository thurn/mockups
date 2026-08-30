"use client";

import {
  createContext,
  useCallback,
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
  soundMuted: boolean;
  isPlaying: boolean;
  startMusic: () => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setMuteInBackground: (muted: boolean) => void;
  setSoundMuted: (muted: boolean) => void;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(null);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [masterVolume, setMasterVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(65);
  const [muteInBackground, setMuteInBackground] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const startMusic = useCallback(() => {
    void audioRef.current?.play().catch(() => {
      // Browsers may defer audible playback until the visitor interacts.
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
  }, [startMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const markPlaying = () => setIsPlaying(true);
    const markNotPlaying = () => setIsPlaying(false);

    audio.addEventListener("playing", markPlaying);
    audio.addEventListener("pause", markNotPlaying);
    audio.addEventListener("waiting", markNotPlaying);
    audio.addEventListener("stalled", markNotPlaying);
    audio.addEventListener("ended", markNotPlaying);
    audio.addEventListener("emptied", markNotPlaying);

    setIsPlaying(!audio.paused && !audio.ended && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA);

    return () => {
      audio.removeEventListener("playing", markPlaying);
      audio.removeEventListener("pause", markNotPlaying);
      audio.removeEventListener("waiting", markNotPlaying);
      audio.removeEventListener("stalled", markNotPlaying);
      audio.removeEventListener("ended", markNotPlaying);
      audio.removeEventListener("emptied", markNotPlaying);
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
        audioRef.current.muted = soundMuted || (muteInBackground && document.hidden);
      }
    };

    syncBackgroundMute();
    document.addEventListener("visibilitychange", syncBackgroundMute);
    return () => document.removeEventListener("visibilitychange", syncBackgroundMute);
  }, [muteInBackground, soundMuted]);

  return (
    <BackgroundMusicContext.Provider
      value={{
        masterVolume,
        musicVolume,
        muteInBackground,
        soundMuted,
        isPlaying,
        startMusic,
        setMasterVolume,
        setMusicVolume,
        setMuteInBackground,
        setSoundMuted,
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
