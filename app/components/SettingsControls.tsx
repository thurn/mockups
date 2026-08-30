"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArcadeButtonEffect } from "./ArcadeButtonEffect";
import {
  actionInnerClip,
  actionOuterClip,
  ClippedInset,
  controlInnerClip,
  controlOuterClip,
} from "./ClippedInset";
import { ArcadeCheckboxEffect } from "./ArcadeCheckboxEffect";
import { SettingRow } from "./SettingRow";
import { useInteraction } from "./useInteraction";
import { keyboardFocusFilter, keyboardFocusGradient } from "./ControlInteraction";

type BaseProps = { label: ReactNode; first?: boolean; offsetY?: number; rowHeight?: number };

const dropdownOpenEvent = "arcade-dropdown-open";
let nextDropdownLayer = 20;

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
  const [isClosing, setIsClosing] = useState(false);
  const [isSuperseded, setIsSuperseded] = useState(false);
  const [menuLayer, setMenuLayer] = useState(20);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const reduceMotion = useReducedMotion();
  const { state: pressState, handlers: pressHandlers } = useInteraction();
  const highlighted = pressState.hovered || pressState.focused;

  useEffect(() => {
    if (!isOpen) return;

    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setIsClosing(true);
      }
    };

    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [isOpen]);

  useEffect(() => {
    const yieldToNewMenu = (event: Event) => {
      const { detail } = event as CustomEvent<string>;
      if (detail === listboxId || (!isOpen && !isClosing)) return;

      setIsSuperseded(true);
      setIsOpen(false);
      setIsClosing(false);
    };

    document.addEventListener(dropdownOpenEvent, yieldToNewMenu);
    return () => document.removeEventListener(dropdownOpenEvent, yieldToNewMenu);
  }, [isClosing, isOpen, listboxId]);

  const openMenu = () => {
    nextDropdownLayer += 1;
    setMenuLayer(nextDropdownLayer);
    setIsSuperseded(false);
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setIsClosing(false);
    setIsOpen(true);
    document.dispatchEvent(new CustomEvent<string>(dropdownOpenEvent, { detail: listboxId }));
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsClosing(true);
  };

  const selectOption = (option: string) => {
    onChange(option);
    closeMenu();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
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
          zIndex: isOpen || isClosing ? menuLayer : 1,
          width: 396,
          height: "100%",
          flex: "none",
          display: "flex",
          alignItems: "center",
          transform: `translateY(${offsetY}px)`,
        }}
      >
        <span
          style={{
            position: "relative",
            width: 396,
            height: 106,
            display: "block",
            overflow: "visible",
          }}
        >
          <button
            {...pressHandlers}
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-label={String(label)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
            onClick={() => (isOpen ? closeMenu() : openMenu())}
            onKeyDown={(event) => {
              pressHandlers.onKeyDown(event);
              handleKeyDown(event);
            }}
            style={{
              position: "relative",
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              clipPath: controlOuterClip,
              padding: "0 74px 0 39px",
              border: 0,
              outline: 0,
              color: "#f5f6fb",
              background: pressState.focused
                ? keyboardFocusGradient
                : highlighted
                  ? "linear-gradient(106deg, #b5ffff, #d3ddff 48%, #ff75dc)"
                  : "linear-gradient(106deg, #5df5ff, #a5cbff 48%, #ff4bc9)",
              filter: pressState.focused
                ? keyboardFocusFilter
                : highlighted || isOpen
                  ? "brightness(1.12) drop-shadow(0 0 13px rgba(83,226,255,.78))"
                  : "drop-shadow(0 0 6px rgba(42,103,255,.38))",
              fontFamily: "'Barlow Condensed', Impact, sans-serif",
              fontWeight: 700,
              fontSize: 60,
              textAlign: "left",
              lineHeight: 1,
              textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
              cursor: "pointer",
              transform: `scale(${pressState.pressed && !reduceMotion ? 0.965 : 1})`,
              transition: "transform 90ms cubic-bezier(.2,.8,.2,1), filter 140ms ease",
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
          <ArcadeButtonEffect burstId={pressState.releaseCount} compact />
        </span>
        {!isSuperseded && (
          <AnimatePresence initial={false} onExitComplete={() => setIsClosing(false)}>
            {isOpen && (
              <motion.div
                key={`${listboxId}-menu`}
                id={listboxId}
                role="listbox"
                aria-label={`${String(label)} options`}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12, scaleY: 0.76 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0.01 } }
                    : {
                        opacity: 0,
                        y: -16,
                        scaleY: 0.42,
                        transition: { duration: 0.26, ease: [0.4, 0, 0.75, 0.3] },
                      }
                }
                transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: [0.2, 0.8, 0.25, 1] }}
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
                  transformOrigin: "top center",
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
                  {options.map((option, index) => (
                    <motion.span
                      key={option}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -17 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
                      transition={{
                        duration: reduceMotion ? 0.01 : 0.18,
                        delay: reduceMotion ? 0 : index * 0.028,
                        ease: "easeOut",
                      }}
                      style={{
                        position: "relative",
                        display: "block",
                        width: "100%",
                        minHeight: 76,
                        overflow: "visible",
                      }}
                    >
                      <DropdownOptionButton
                        id={`${listboxId}-option-${index}`}
                        option={option}
                        selected={option === value}
                        active={index === activeIndex}
                        onPointerEnter={() => setActiveIndex(index)}
                        onSelect={() => selectOption(option)}
                      />
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </SettingRow>
  );
}

function DropdownOptionButton({
  id,
  option,
  selected,
  active,
  onPointerEnter,
  onSelect,
}: {
  id: string;
  option: string;
  selected: boolean;
  active: boolean;
  onPointerEnter: () => void;
  onSelect: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const { state, handlers } = useInteraction();

  return (
    <>
      <button
        {...handlers}
        id={id}
        type="button"
        role="option"
        aria-selected={selected}
        onPointerEnter={onPointerEnter}
        onClick={onSelect}
        style={{
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          width: "100%",
          minHeight: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          border: 0,
          outline: 0,
          padding: "6px 20px 6px 25px",
          color: selected ? "#efffff" : "#d9e1f2",
          background: state.focused
            ? "linear-gradient(90deg, rgba(255,238,0,.32), rgba(255,167,0,.14))"
            : active
              ? "linear-gradient(90deg, rgba(11,113,207,.5), rgba(88,69,177,.28) 66%, rgba(229,39,177,.2))"
              : "transparent",
          boxShadow: state.focused
            ? "inset 0 0 0 3px #fff400, 0 0 11px rgba(255,219,0,.72)"
            : active
              ? "inset 0 0 18px rgba(55,156,255,.28)"
              : undefined,
          fontFamily: "'Barlow Condensed', Impact, sans-serif",
          fontWeight: 700,
          fontSize: 47,
          lineHeight: 1,
          textAlign: "left",
          textShadow: "2px 3px 0 #172747, 0 3px 5px #000",
          cursor: "pointer",
          transform: `scale(${state.pressed && !reduceMotion ? 0.965 : 1})`,
          filter: state.hovered ? "brightness(1.2)" : undefined,
          transition:
            "transform 90ms cubic-bezier(.2,.8,.2,1), box-shadow 140ms ease, filter 140ms ease",
        }}
      >
        <AnimatePresence initial={false}>
          {selected && (
            <motion.span
              key="selection-flash"
              initial={{ opacity: 0.9, scale: 0.96 }}
              animate={{ opacity: 0, scale: 1.035 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.38, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 3,
                border: "2px solid #66f6ff",
                boxShadow: "inset 0 0 12px rgba(47,143,255,.55), 0 0 10px #ff50d1",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>
        <span style={{ position: "relative", zIndex: 1 }}>{option}</span>
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            zIndex: 1,
            flex: "none",
            width: 48,
            height: 44,
          }}
        >
          {selected && <CheckMark scale={0.62} />}
        </span>
      </button>
      <ArcadeButtonEffect burstId={state.releaseCount} compact />
    </>
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
  const { state, handlers } = useInteraction();
  const reduceMotion = useReducedMotion();

  return (
    <label
      style={{
        display: "block",
        height: rowHeight,
        cursor: "pointer",
      }}
    >
      <SettingRow
        label={
          <>
            {label}
            {withInfo && <InfoBadge />}
          </>
        }
        rowHeight={rowHeight}
      >
        <span
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
          <ArcadeCheckboxEffect checked={checked} />
          <input
            {...handlers}
            suppressHydrationWarning
            aria-label={ariaLabel ?? String(label)}
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            type="checkbox"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              width: 77,
              height: 77,
              margin: 0,
              opacity: 0,
              cursor: "pointer",
              outline: 0,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "relative",
              zIndex: 1,
              boxSizing: "border-box",
              width: 77,
              height: 77,
              border: state.focused
                ? "4px solid #fff400"
                : state.hovered
                  ? "4px solid #91faff"
                  : "4px solid #4ba3ff",
              borderRadius: 11,
              background: "linear-gradient(180deg, #06142b, #02091a)",
              boxShadow: state.focused
                ? "inset 0 0 14px #000, 0 0 4px #fff, 0 0 16px #ffd900"
                : state.hovered
                  ? "inset 0 0 12px #000, 0 0 15px #2acfff, 0 0 8px #b8ffff"
                  : "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff",
              filter: state.pressed ? "brightness(.76)" : undefined,
              transform: `scale(${state.pressed && !reduceMotion ? 0.88 : state.hovered ? 1.045 : 1})`,
              transition:
                "transform 90ms cubic-bezier(.2,.8,.2,1), filter 90ms ease, border 140ms ease, box-shadow 140ms ease",
            }}
          >
            {checked && <CheckMark />}
          </span>
        </span>
      </SettingRow>
    </label>
  );
}

export function EraseControl() {
  const { state, handlers } = useInteraction();
  const reduceMotion = useReducedMotion();

  return (
    <SettingRow label="Erase Saved Data">
      <span
        style={{
          position: "relative",
          width: 362,
          height: 114,
          marginLeft: 21,
          display: "block",
          overflow: "visible",
          transform: "translateY(-8px)",
        }}
      >
        <button
          {...handlers}
          type="button"
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            border: 0,
            outline: 0,
            padding: 0,
            clipPath: actionOuterClip,
            color: "#ff3553",
            background: state.focused
              ? keyboardFocusGradient
              : state.hovered
                ? "linear-gradient(110deg, #ff657f, #ff204f 55%, #ff75a1)"
                : "#ff355e",
            filter: state.focused
              ? keyboardFocusFilter
              : state.hovered
                ? "brightness(1.16) drop-shadow(0 0 15px rgba(255,45,101,.82))"
                : "drop-shadow(0 0 9px rgba(255,20,78,.55))",
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontWeight: 700,
            fontSize: 67,
            textShadow: "0 0 11px rgba(255,25,76,.55)",
            cursor: "pointer",
            transform: `scale(${state.pressed && !reduceMotion ? 0.96 : 1})`,
            transition: "transform 90ms cubic-bezier(.2,.8,.2,1)",
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
        <ArcadeButtonEffect burstId={state.releaseCount} compact />
      </span>
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
        left: 205,
        bottom: 37,
        boxSizing: "border-box",
        width: 38,
        height: 38,
        display: "grid",
        placeItems: "center",
        border: "2px solid #55b8ff",
        borderRadius: "50%",
        color: "#bcf4ff",
        fontFamily: "Georgia, serif",
        fontSize: 27,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 1,
        textTransform: "lowercase",
        boxShadow: "0 0 8px #155eff, inset 0 0 7px rgba(13,76,180,.8)",
        transform: "translateY(1px) scaleX(.957)",
      }}
    >
      i
    </span>
  );
}
