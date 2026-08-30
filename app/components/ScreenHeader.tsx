"use client";

import { useUiRenderMode } from "./UiRenderMode";
import Image from "next/image";
import { dynamicTypeScale, useFontScale } from "./FontScale";

export function ScreenHeader({ variant }: { variant: "game" | "settings" }) {
  const game = variant === "game";
  const { mode } = useUiRenderMode();

  return (
    <header
      style={{
        position: "absolute",
        zIndex: 5,
        top: game ? 103 : 74,
        left: 84,
        width: 854,
        height: game ? 330 : 122,
        display: "grid",
        placeItems: "center",
      }}
    >
      <StripeBar side="left" top={game ? 132 : 44} />
      <StripeBar side="right" top={game ? 132 : 44} />
      {game ? mode === "png" ? <GameWordmarkImage /> : <GameWordmark /> : <SettingsTitle />}
    </header>
  );
}

function GameWordmarkImage() {
  const { fontScale } = useFontScale();
  const headingScale = dynamicTypeScale(fontScale, "heading");

  return (
    <h1
      aria-label="Chess Chess Revolution"
      style={{
        position: "absolute",
        zIndex: 2,
        inset: 0,
        margin: 0,
        pointerEvents: "none",
      }}
    >
      <Image
        alt=""
        src="/generated-ui/game-logo.png"
        width={1800}
        height={720}
        unoptimized
        style={{
          position: "absolute",
          left: "calc(50% + 14px)",
          top: "calc(50% + 5px)",
          width: 900 * headingScale,
          height: 360 * headingScale,
          transform: "translate(-50%, -50%)",
        }}
      />
    </h1>
  );
}

function GameWordmark() {
  const { fontScale } = useFontScale();

  return (
    <h1
      style={{
        position: "relative",
        zIndex: 2,
        margin: 0,
        padding: "18px 24px 34px 4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "transparent",
        background:
          "linear-gradient(174deg, #ffffff 2%, #e5f5ff 20%, #74c9ff 38%, #f8fbff 51%, #8d72ff 70%, #ff68d9 94%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "1.4px #f9ffff",
        fontFamily: "'Barlow Condensed', Impact, sans-serif",
        fontSize: 160 * dynamicTypeScale(fontScale, "heading"),
        fontStyle: "italic",
        fontWeight: 800,
        lineHeight: 0.74,
        letterSpacing: "-4px",
        textAlign: "center",
        transform: "translate(10px, -2px) scale(1.02, .9) skewX(-5deg)",
        filter:
          "drop-shadow(4px 6px 0 #092463) drop-shadow(-3px -2px 0 #61096a) drop-shadow(0 12px 8px #000)",
      }}
    >
      <span>CHESS CHESS</span>
      <span>REVOLUTION</span>
    </h1>
  );
}

function SettingsTitle() {
  const { fontScale } = useFontScale();

  return (
    <h1
      style={{
        position: "relative",
        zIndex: 2,
        margin: "-20px 0 -26px",
        padding: "20px 20px 36px 4px",
        color: "transparent",
        background:
          "linear-gradient(174deg, #ffffff 2%, #e5f5ff 20%, #74c9ff 38%, #f8fbff 51%, #8d72ff 70%, #ff68d9 94%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "1.4px #f9ffff",
        fontFamily: "'Barlow Condensed', Impact, sans-serif",
        fontSize: 165 * dynamicTypeScale(fontScale, "heading"),
        fontStyle: "italic",
        fontWeight: 800,
        lineHeight: 0.82,
        letterSpacing: "-5px",
        transform: "translate(14px, -7px) scale(1.01, .83) skewX(-5deg)",
        filter:
          "drop-shadow(4px 6px 0 #092463) drop-shadow(-3px -2px 0 #61096a) drop-shadow(0 12px 8px #000)",
      }}
    >
      Settings
    </h1>
  );
}

function StripeBar({ side, top }: { side: "left" | "right"; top: number }) {
  const isLeft = side === "left";
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        [isLeft ? "left" : "right"]: 0,
        width: 314,
        height: 58,
        clipPath: isLeft
          ? "polygon(0 0, 100% 0, 93% 100%, 0 100%)"
          : "polygon(7% 0, 100% 0, 100% 100%, 0 100%)",
        background: isLeft
          ? "repeating-linear-gradient(132deg, #075fff 0 17px, #05164b 17px 32px)"
          : "repeating-linear-gradient(132deg, #f21160 0 17px, #4b0827 17px 32px)",
        boxShadow: isLeft ? "0 0 18px #075fff" : "0 0 18px #f21160",
      }}
    />
  );
}
