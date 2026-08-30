"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { frameOuterBottom, frameOuterInset, framePulseClip } from "./styles";

const settingsReturnCutout = {
  maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  maskPosition: "0 0, 0 100%, 100% 100%",
  maskRepeat: "no-repeat",
  maskSize: "100% 1329px, 297px 75px, 297px 75px",
} as const;

export function ArcadeFramePulse() {
  const reduceMotion = Boolean(useReducedMotion());
  const hasSettingsReturnCutout = usePathname() === "/settings";

  return (
    <div
      aria-hidden="true"
      data-frame-pulse
      style={{
        position: "absolute",
        zIndex: 1,
        top: frameOuterInset,
        right: frameOuterInset,
        bottom: frameOuterBottom,
        left: frameOuterInset,
        overflow: "hidden",
        clipPath: framePulseClip,
        opacity: reduceMotion ? 0.28 : 1,
        mixBlendMode: "screen",
        pointerEvents: "none",
        ...(hasSettingsReturnCutout
          ? {
              ...settingsReturnCutout,
              WebkitMaskImage: settingsReturnCutout.maskImage,
              WebkitMaskPosition: settingsReturnCutout.maskPosition,
              WebkitMaskRepeat: settingsReturnCutout.maskRepeat,
              WebkitMaskSize: settingsReturnCutout.maskSize,
            }
          : undefined),
      }}
    >
      <style>{`
        @keyframes arcade-border-comet-lap {
          0% { left: 0%; top: 0%; transform: translate(-50%, -50%) rotate(0deg); }
          24% { left: 100%; top: 0%; transform: translate(-50%, -50%) rotate(0deg); }
          25% { left: 98.1%; top: 0%; transform: translate(-50%, -50%) rotate(90deg); }
          49% { left: 98.1%; top: 100%; transform: translate(-50%, -50%) rotate(90deg); }
          50% { left: 100%; top: 100%; transform: translate(-50%, -50%) rotate(180deg); }
          74% { left: 0%; top: 100%; transform: translate(-50%, -50%) rotate(180deg); }
          75% { left: 1.9%; top: 100%; transform: translate(-50%, -50%) rotate(270deg); }
          99% { left: 1.9%; top: 0%; transform: translate(-50%, -50%) rotate(270deg); }
          100% { left: 0%; top: 0%; transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-frame-pulse] { opacity: .28 !important; }
          [data-border-beam] { animation: none !important; }
        }
      `}</style>
      <PulseBeam
        width={270}
        height={76}
        background="radial-gradient(ellipse, rgba(255,255,255,.95) 0 7%, rgba(69,225,255,.92) 24%, rgba(48,138,255,.6) 49%, rgba(255,61,205,.34) 68%, transparent 78%)"
        filter="brightness(2) drop-shadow(0 0 11px rgba(255,255,255,.95)) drop-shadow(0 0 25px rgba(71,211,255,1)) drop-shadow(0 0 34px rgba(255,71,207,.92))"
        reduceMotion={reduceMotion}
      />
      <PulseBeam
        width={86}
        height={30}
        background="radial-gradient(ellipse, #fff 0 20%, #bdf5ff 42%, #ffb5ec 64%, transparent 76%)"
        filter="brightness(2.8) drop-shadow(0 0 7px #fff) drop-shadow(0 0 15px #77e6ff)"
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

function PulseBeam({
  background,
  filter,
  height,
  reduceMotion,
  width,
}: {
  background: string;
  filter: string;
  height: number;
  reduceMotion: boolean;
  width: number;
}) {
  return (
    <div
      data-border-beam
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: "50%",
        background,
        filter,
        animation: reduceMotion ? undefined : "arcade-border-comet-lap 6.5s linear infinite",
        willChange: reduceMotion ? undefined : "left, top, transform",
      }}
    />
  );
}
