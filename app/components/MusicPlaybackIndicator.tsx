"use client";

import { SpeakerSlashIcon } from "@phosphor-icons/react/dist/csr/SpeakerSlash";
import { useBackgroundMusic } from "./BackgroundMusic";

export function MusicPlaybackIndicator() {
  const {
    isPlaying,
    masterVolume,
    musicVolume,
    setMasterVolume,
    setMusicVolume,
    setSoundMuted,
    soundMuted,
    startMusic,
  } = useBackgroundMusic();
  const soundEnabled = isPlaying && !soundMuted && masterVolume > 0 && musicVolume > 0;

  const toggleSound = () => {
    if (soundEnabled) {
      setSoundMuted(true);
      return;
    }

    if (masterVolume === 0) setMasterVolume(80);
    if (musicVolume === 0) setMusicVolume(65);
    setSoundMuted(false);
    startMusic();
  };

  return (
    <button
      type="button"
      aria-label={soundEnabled ? "Mute background music" : "Enable background music"}
      aria-live="polite"
      data-testid="music-playback-indicator"
      onClick={toggleSound}
      onKeyDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      style={{
        position: "absolute",
        zIndex: 4,
        right: 80,
        bottom: 218,
        left: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        border: 0,
        color: "#fff",
        background: "transparent",
        fontFamily: "'Barlow Condensed', Impact, sans-serif",
        fontSize: 56,
        fontWeight: 700,
        lineHeight: 1.02,
        letterSpacing: ".3px",
        textAlign: "center",
        textShadow: "0 3px 8px #000, 0 0 8px rgba(111,188,255,.35)",
        cursor: "pointer",
        filter: "var(--music-control-pulse-filter, brightness(1))",
        transform: "var(--music-control-pulse-transform, scale(1))",
        transformOrigin: "50% 50%",
      }}
    >
      {!soundEnabled && (
        <SpeakerSlashIcon
          aria-hidden="true"
          size={54}
          weight="fill"
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(100% + 18px)",
            color: "#969ba9",
            filter: "drop-shadow(0 0 8px #000)",
            transform: "translateX(-50%)",
          }}
        />
      )}
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>Playing with sound</span>
        <span>is recommended!</span>
      </span>
    </button>
  );
}
