"use client";

import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { frameClip, frameInteriorBounds } from "./styles";

type Star = {
  color: string;
  duration: number;
  phase: number;
  size: number;
  x: number;
  y: number;
};

const starColors = ["#bff8ff", "#5bd4ff", "#ffffff", "#d59bff", "#ff67d5"];

function createStars(count: number): Star[] {
  let seed = 0xcca7e;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  return Array.from({ length: count }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const radius = 0.72 + random() * 0.46;

    return {
      color: starColors[index % starColors.length],
      duration: 4.8 + random() * 4.6,
      phase: random(),
      size: 2.2 + random() * 3.8,
      x: Math.cos(angle) * 475 * radius,
      y: Math.sin(angle) * 685 * radius,
    };
  });
}

const stars = createStars(42);

export function ArcadeStarfield() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 1,
        ...frameInteriorBounds,
        overflow: "hidden",
        clipPath: frameClip,
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes arcade-star-flight {
          0% { transform: translate(var(--star-start-x), var(--star-start-y)) scale(.2); opacity: 0; }
          18% { opacity: .18; }
          68% { opacity: .72; }
          100% { transform: translate(var(--star-end-x), var(--star-end-y)) scale(1.45); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(20,42,93,.08) 0%, rgba(3,9,28,.12) 34%, rgba(0,2,11,.45) 100%)",
        }}
      />
      {stars.map((star, index) => {
        const startX = star.x * 0.13;
        const startY = star.y * 0.13;

        return (
          <span
            key={index}
            style={
              {
                position: "absolute",
                top: "48%",
                left: "50%",
                width: star.size,
                height: star.size,
                marginTop: -star.size / 2,
                marginLeft: -star.size / 2,
                borderRadius: "50%",
                background: star.color,
                boxShadow: `0 0 ${star.size * 2.8}px ${star.color}`,
                opacity: reduceMotion ? 0.24 : undefined,
                transform: reduceMotion
                  ? `translate(${star.x * 0.72}px, ${star.y * 0.72}px) scale(.7)`
                  : undefined,
                animation: reduceMotion
                  ? undefined
                  : `arcade-star-flight ${star.duration}s linear ${-star.phase * star.duration}s infinite`,
                willChange: reduceMotion ? undefined : "transform, opacity",
                "--star-start-x": `${startX}px`,
                "--star-start-y": `${startY}px`,
                "--star-end-x": `${star.x}px`,
                "--star-end-y": `${star.y}px`,
              } as CSSProperties
            }
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 49%, rgba(1,4,16,.64) 0 24%, transparent 54%), linear-gradient(90deg, rgba(1,3,12,.16), transparent 16% 84%, rgba(1,3,12,.16))",
        }}
      />
    </div>
  );
}
