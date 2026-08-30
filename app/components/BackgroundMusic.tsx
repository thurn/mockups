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

const heartbeatPeriod = 60 / 56;
const heartbeatSecondHit = 0.13393;
const heartbeatPhase = 1.04;

function setControlPulse(strength: number) {
  const root = document.documentElement;
  const easedStrength = Math.max(0, Math.min(1, strength));
  const scale = 1 + easedStrength * 0.012;
  const brightness = 1 + easedStrength * 0.075;
  const glow = easedStrength * 7;

  root.style.setProperty("--music-control-pulse-transform", `scale(${scale})`);
  root.style.setProperty(
    "--music-control-pulse-filter",
    `brightness(${brightness}) drop-shadow(0 0 ${glow}px rgba(91, 224, 255, ${easedStrength * 0.34}))`,
  );
}

function heartbeatStrength(currentTime: number) {
  const cyclePosition =
    (((currentTime - heartbeatPhase) % heartbeatPeriod) + heartbeatPeriod) % heartbeatPeriod;
  const timeSinceFirstHit = cyclePosition;
  const timeSinceSecondHit =
    (cyclePosition - heartbeatSecondHit + heartbeatPeriod) % heartbeatPeriod;
  const timeSinceHit = Math.min(timeSinceFirstHit, timeSinceSecondHit);

  if (timeSinceHit > 0.14) return 0;
  return Math.exp(-timeSinceHit / 0.045) * (1 - timeSinceHit / 0.14);
}

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

    setIsPlaying(
      !audio.paused && !audio.ended && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA,
    );

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
    const audio = audioRef.current;
    if (!audio) return;

    let animationFrame = 0;

    const updatePulse = () => {
      if (audio.paused || audio.ended || audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        setControlPulse(0);
        return;
      }

      setControlPulse(heartbeatStrength(audio.currentTime));
      animationFrame = window.requestAnimationFrame(updatePulse);
    };

    const startPulse = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updatePulse);
    };

    const stopPulse = () => {
      window.cancelAnimationFrame(animationFrame);
      setControlPulse(0);
    };

    audio.addEventListener("playing", startPulse);
    audio.addEventListener("pause", stopPulse);
    audio.addEventListener("waiting", stopPulse);
    audio.addEventListener("stalled", stopPulse);
    audio.addEventListener("ended", stopPulse);

    if (!audio.paused) startPulse();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      audio.removeEventListener("playing", startPulse);
      audio.removeEventListener("pause", stopPulse);
      audio.removeEventListener("waiting", stopPulse);
      audio.removeEventListener("stalled", stopPulse);
      audio.removeEventListener("ended", stopPulse);
      setControlPulse(0);
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
