"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  actionInnerClip,
  actionOuterClip,
  ClippedInset,
  controlInnerClip,
  controlOuterClip,
} from "./ClippedInset";
import { SettingRow } from "./SettingRow";

type BaseProps = { label: ReactNode; first?: boolean; offsetY?: number; rowHeight?: number };

export function SelectControl({
  label,
  options,
  value,
  onChange,
  first = false,
  offsetY = 0,
  rowHeight,
}: BaseProps & { options: string[]; value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [isOpen]);

  const openMenu = () => {
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setIsOpen(true);
  };

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (!isOpen) openMenu();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + options.length) % options.length);
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isOpen) {
      event.preventDefault();
      selectOption(options[activeIndex]);
    }
  };

  return (
    <SettingRow first={first} label={label} rowHeight={rowHeight}>
      <div
        ref={rootRef}
        style={{
          position: "relative",
          zIndex: isOpen ? 20 : 1,
          width: 396,
          height: "100%",
          flex: "none",
          display: "flex",
          alignItems: "center",
          transform: `translateY(${offsetY}px)`,
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-label={String(label)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
          onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
          onKeyDown={handleKeyDown}
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: 396,
            height: 106,
            display: "flex",
            alignItems: "center",
            clipPath: controlOuterClip,
            padding: "0 74px 0 39px",
            border: 0,
            color: "#f5f6fb",
            background: "linear-gradient(106deg, #5df5ff, #a5cbff 48%, #ff4bc9)",
            filter: isOpen
              ? "drop-shadow(0 0 12px rgba(83,226,255,.7))"
              : "drop-shadow(0 0 6px rgba(42,103,255,.38))",
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontWeight: 700,
            fontSize: 60,
            textAlign: "left",
            lineHeight: 1,
            textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
            cursor: "pointer",
          }}
        >
          <ClippedInset
            inset={3}
            clipPath={controlInnerClip}
            background="linear-gradient(180deg, #050b1c, #020611)"
            boxShadow="inset 0 0 24px #000"
          />
          <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
          <Caret isOpen={isOpen} />
        </button>
        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            aria-label={`${String(label)} options`}
            style={{
              position: "absolute",
              left: 0,
              top: "calc(50% + 59px)",
              zIndex: 30,
              boxSizing: "border-box",
              width: 396,
              padding: 3,
              clipPath: controlOuterClip,
              background: "linear-gradient(145deg, #5df5ff, #718cff 48%, #ff4bc9)",
              filter:
                "drop-shadow(0 10px 14px rgba(0,0,0,.72)) drop-shadow(0 0 8px rgba(43,126,255,.65))",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                clipPath: controlInnerClip,
                padding: "8px 6px",
                background:
                  "radial-gradient(circle at 20% 0%, rgba(30,95,195,.25), transparent 48%), linear-gradient(180deg, #07152e, #020611)",
                boxShadow: "inset 0 0 24px #000",
              }}
            >
              {options.map((option, index) => {
                const selected = option === value;
                const active = index === activeIndex;

                return (
                  <button
                    id={`${listboxId}-option-${index}`}
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onPointerEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                    style={{
                      boxSizing: "border-box",
                      width: "100%",
                      minHeight: 76,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 14,
                      border: 0,
                      borderTop: index === 0 ? 0 : "2px solid rgba(70,112,179,.28)",
                      padding: "6px 20px 6px 25px",
                      color: selected ? "#efffff" : "#d9e1f2",
                      background: active
                        ? "linear-gradient(90deg, rgba(11,113,207,.5), rgba(88,69,177,.28) 66%, rgba(229,39,177,.2))"
                        : "transparent",
                      boxShadow: active ? "inset 4px 0 0 #61f1ff" : "none",
                      fontFamily: "'Barlow Condensed', Impact, sans-serif",
                      fontWeight: 700,
                      fontSize: 47,
                      lineHeight: 1,
                      textAlign: "left",
                      textShadow: "2px 3px 0 #172747, 0 3px 5px #000",
                      cursor: "pointer",
                    }}
                  >
                    <span>{option}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        position: "relative",
                        flex: "none",
                        width: 48,
                        height: 48,
                        border: `3px solid ${selected ? "#55cfff" : "#334f7c"}`,
                        borderRadius: 8,
                        background: "linear-gradient(180deg, #06142b, #02091a)",
                        boxShadow: selected
                          ? "inset 0 0 10px #000, 0 0 8px #166cff"
                          : "inset 0 0 10px #000",
                      }}
                    >
                      {selected && <CheckMark scale={0.62} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SettingRow>
  );
}

function Caret({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 2,
        top: "50%",
        right: 45,
        width: 0,
        height: 0,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        borderTop: "18px solid #f4f5fa",
        filter: "drop-shadow(0 3px 2px #000)",
        pointerEvents: "none",
        transform: `translateY(-50%) rotate(${isOpen ? 180 : 0}deg)`,
        transition: "transform 140ms ease",
      }}
    />
  );
}

export function ToggleControl({
  checked,
  label,
  ariaLabel,
  onChange,
  withInfo = false,
  rowHeight,
  offsetY = 0,
}: BaseProps & {
  checked: boolean;
  ariaLabel?: string;
  onChange: (checked: boolean) => void;
  withInfo?: boolean;
}) {
  return (
    <SettingRow
      label={
        <>
          {label}
          {withInfo && <InfoBadge />}
        </>
      }
      rowHeight={rowHeight}
    >
      <label
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: 77,
          height: 77,
          marginLeft: 8,
          cursor: "pointer",
          transform: `translateY(${offsetY}px)`,
        }}
      >
        <input
          suppressHydrationWarning
          aria-label={ariaLabel ?? String(label)}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            width: 77,
            height: 77,
            margin: 0,
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: 77,
            height: 77,
            border: "4px solid #4ba3ff",
            borderRadius: 11,
            background: "linear-gradient(180deg, #06142b, #02091a)",
            boxShadow: "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff",
          }}
        >
          {checked && <CheckMark />}
        </span>
      </label>
    </SettingRow>
  );
}

export function EraseControl() {
  return (
    <SettingRow label="Erase Saved Data">
      <button
        type="button"
        style={{
          position: "relative",
          boxSizing: "border-box",
          width: 362,
          height: 114,
          marginLeft: 21,
          display: "grid",
          placeItems: "center",
          border: 0,
          padding: 0,
          clipPath: actionOuterClip,
          color: "#ff3553",
          background: "#ff355e",
          filter: "drop-shadow(0 0 9px rgba(255,20,78,.55))",
          fontFamily: "'Barlow Condensed', Impact, sans-serif",
          fontWeight: 700,
          fontSize: 67,
          textShadow: "0 0 11px rgba(255,25,76,.55)",
          cursor: "pointer",
          transform: "translateY(-8px)",
        }}
      >
        <ClippedInset
          inset={4}
          clipPath={actionInnerClip}
          background="radial-gradient(ellipse at 50% 45%, #200511, #07030c 67%, #020208)"
          boxShadow="inset 0 0 22px #000"
        />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            lineHeight: 0.9,
            transform: "translateY(-1px)",
          }}
        >
          ERASE
        </span>
      </button>
    </SettingRow>
  );
}

function CheckMark({ scale = 1 }: { scale?: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 50,
        height: 44,
        clipPath: "polygon(0 47%, 14% 32%, 35% 58%, 85% 0, 100% 14%, 35% 100%)",
        background: "#61f1ff",
        transform: `translate(-50%, -50%) scale(${scale})`,
        filter: "drop-shadow(0 0 7px #128dff)",
      }}
    />
  );
}

function InfoBadge() {
  return (
    <span
      aria-label="Crash reports help diagnose errors"
      title="Crash reports help diagnose errors"
      style={{
        position: "absolute",
        left: 201,
        bottom: 25,
        boxSizing: "border-box",
        width: 58,
        height: 58,
        display: "grid",
        placeItems: "center",
        border: "3px solid #55b8ff",
        borderRadius: "50%",
        color: "#bcf4ff",
        fontFamily: "Georgia, serif",
        fontSize: 39,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 1,
        textTransform: "lowercase",
        boxShadow: "0 0 11px #155eff, inset 0 0 10px rgba(13,76,180,.8)",
        transform: "scaleX(.957)",
      }}
    >
      i
    </span>
  );
}
