"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import {
  frameClip,
  frameInteriorBounds,
  frameOuterBottom,
  frameOuterInset,
  framePulseClip,
} from "./styles";

type Particle = {
  color: string;
  driftX: number;
  driftY: number;
  duration: number;
  phase: number;
  size: number;
  x: number;
  y: number;
};

const particleColors = ["#bff8ff", "#59cfff", "#ffffff", "#cf9cff", "#ff69d7"];

function createParticles(count: number): Particle[] {
  let seed = 0xa77ac7;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  return Array.from({ length: count }, (_, index) => ({
    color: particleColors[index % particleColors.length],
    driftX: -36 + random() * 72,
    driftY: -125 - random() * 155,
    duration: 10 + random() * 9,
    phase: random(),
    size: 2.5 + random() * 3.5,
    x: 4 + random() * 92,
    y: 18 + random() * 82,
  }));
}

const particles = createParticles(20);
const gridRays = [-22, -16.5, -11, -5.5, 0, 5.5, 11, 16.5, 22];
const gridHorizons = [
  { top: 23, width: 10 },
  { top: 28, width: 18 },
  { top: 34, width: 29 },
  { top: 42, width: 42 },
  { top: 52, width: 57 },
  { top: 65, width: 75 },
  { top: 82, width: 96 },
];

export function ArcadeAttractMode() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", zIndex: 1, inset: 0, pointerEvents: "none" }}
    >
      <style>{`
        @keyframes arcade-grid-breathe {
          from { transform: translateY(-6px) scaleY(.96); opacity: .58; }
          to { transform: translateY(12px) scaleY(1.02); opacity: 1; }
        }
        @keyframes arcade-particle-drift {
          0% { transform: translate3d(0, 90px, 0) scale(.7); opacity: 0; }
          16% { opacity: .38; }
          72% { opacity: .5; }
          100% { transform: translate3d(var(--particle-drift-x), var(--particle-drift-y), 0) scale(1.05); opacity: 0; }
        }
        @keyframes arcade-border-comet-lap {
          0% { left: 0%; top: 0%; transform: translate(-50%, -50%) rotate(0deg); }
          24% { left: 100%; top: 0%; transform: translate(-50%, -50%) rotate(0deg); }
          25% { left: 100%; top: 0%; transform: translate(-50%, -50%) rotate(90deg); }
          49% { left: 100%; top: 100%; transform: translate(-50%, -50%) rotate(90deg); }
          50% { left: 100%; top: 100%; transform: translate(-50%, -50%) rotate(180deg); }
          74% { left: 0%; top: 100%; transform: translate(-50%, -50%) rotate(180deg); }
          75% { left: 0%; top: 100%; transform: translate(-50%, -50%) rotate(270deg); }
          99% { left: 0%; top: 0%; transform: translate(-50%, -50%) rotate(270deg); }
          100% { left: 0%; top: 0%; transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-attract-motion="grid"] {
            animation: none !important;
            transform: none !important;
            opacity: .26 !important;
          }
          [data-attract-motion="particle"] {
            animation: none !important;
            transform: scale(.85) !important;
            opacity: .23 !important;
          }
          [data-attract-motion="border"] {
            opacity: .28 !important;
          }
          [data-border-beam] { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          ...frameInteriorBounds,
          overflow: "hidden",
          clipPath: frameClip,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 68%, rgba(18,76,144,.18), transparent 49%), linear-gradient(180deg, rgba(3,9,26,.02), rgba(1,5,18,.24))",
          }}
        />

        <PerspectiveGrid reduceMotion={Boolean(reduceMotion)} />

        {particles.map((particle, index) => (
          <span
            key={index}
            data-attract-motion="particle"
            style={
              {
                position: "absolute",
                zIndex: 2,
                top: `${particle.y}%`,
                left: `${particle.x}%`,
                width: particle.size,
                height: particle.size,
                borderRadius: "50%",
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                opacity: reduceMotion ? 0.23 : undefined,
                transform: reduceMotion ? "translate3d(0, 0, 0) scale(.85)" : undefined,
                animation: reduceMotion
                  ? undefined
                  : `arcade-particle-drift ${particle.duration}s linear ${-particle.phase * particle.duration}s infinite`,
                willChange: reduceMotion ? undefined : "transform, opacity",
                "--particle-drift-x": `${particle.driftX}px`,
                "--particle-drift-y": `${particle.driftY}px`,
              } as CSSProperties
            }
          />
        ))}

        <div
          style={{
            position: "absolute",
            zIndex: 3,
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 44%, rgba(1,4,16,.7) 0 26%, transparent 60%), linear-gradient(90deg, rgba(1,3,12,.22), transparent 17% 83%, rgba(1,3,12,.22))",
          }}
        />
      </div>

      <BorderPulse reduceMotion={Boolean(reduceMotion)} />
    </div>
  );
}

function BorderPulse({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      data-attract-motion="border"
      style={
        {
          position: "absolute",
          zIndex: 4,
          top: frameOuterInset,
          right: frameOuterInset,
          bottom: frameOuterBottom,
          left: frameOuterInset,
          overflow: "hidden",
          clipPath: framePulseClip,
          opacity: reduceMotion ? 0.28 : 1,
          mixBlendMode: "screen",
        } as CSSProperties
      }
    >
      <div
        data-border-beam
        style={{
          position: "absolute",
          width: 270,
          height: 76,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,.95) 0 7%, rgba(69,225,255,.92) 24%, rgba(48,138,255,.6) 49%, rgba(255,61,205,.34) 68%, transparent 78%)",
          filter:
            "brightness(2) drop-shadow(0 0 11px rgba(255,255,255,.95)) drop-shadow(0 0 25px rgba(71,211,255,1)) drop-shadow(0 0 34px rgba(255,71,207,.92))",
          animation: reduceMotion ? undefined : "arcade-border-comet-lap 6.5s linear infinite",
          willChange: reduceMotion ? undefined : "left, top, transform",
        }}
      />
      <div
        data-border-beam
        style={{
          position: "absolute",
          width: 86,
          height: 30,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, #fff 0 20%, #bdf5ff 42%, #ffb5ec 64%, transparent 76%)",
          filter: "brightness(2.8) drop-shadow(0 0 7px #fff) drop-shadow(0 0 15px #77e6ff)",
          animation: reduceMotion ? undefined : "arcade-border-comet-lap 6.5s linear infinite",
          willChange: reduceMotion ? undefined : "left, top, transform",
        }}
      />
    </div>
  );
}

function PerspectiveGrid({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      data-testid="perspective-grid"
      data-attract-motion="grid"
      style={{
        position: "absolute",
        zIndex: 1,
        top: "20%",
        right: "4%",
        bottom: "5%",
        left: "4%",
        overflow: "hidden",
        opacity: 0.26,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 17%, #000 86%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 17%, #000 86%, transparent 100%)",
        transformOrigin: "center top",
        animation: reduceMotion
          ? undefined
          : "arcade-grid-breathe 5.2s ease-in-out infinite alternate",
        willChange: reduceMotion ? undefined : "transform, opacity",
      }}
    >
      {gridRays.map((angle) => (
        <span
          key={angle}
          style={{
            position: "absolute",
            top: "21%",
            left: "50%",
            width: 2,
            height: "76%",
            background: "linear-gradient(180deg, rgba(94,212,255,.08), rgba(94,212,255,.78))",
            boxShadow: "0 0 7px rgba(64,186,255,.34)",
            transform: `rotate(${angle}deg)`,
            transformOrigin: "center top",
          }}
        />
      ))}
      {gridHorizons.map((line) => (
        <span
          key={line.top}
          style={{
            position: "absolute",
            top: `${line.top}%`,
            left: "50%",
            width: `${line.width}%`,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, rgba(94,212,255,.68) 12%, rgba(210,116,255,.62) 88%, transparent)",
            boxShadow: "0 0 7px rgba(152,101,255,.28)",
            transform: "translateX(-50%)",
          }}
        />
      ))}
    </div>
  );
}
