"use client";

import { motionAriaProps } from "./motionAriaProps";

import { useRef, type RefObject } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
import {
  FocusScope,
  DismissButton,
  mergeProps,
  useListBox,
  useOption,
  usePopover,
  type AriaListBoxOptions,
} from "react-aria";
import type { Node, SelectState } from "react-stately";
import { controlInnerClip, controlOuterClip } from "./ClippedInset";
import { ArcadeButtonEffect } from "./ArcadeButtonEffect";
import { useInteraction } from "./useInteraction";
import { dynamicTypeScale, useFontScale } from "./FontScale";
import { CheckMark } from "./CheckMark";

export function SelectPopover({
  state,
  menuProps,
  triggerRef,
  controlWidth,
  controlHeight,
}: {
  state: SelectState<object>;
  menuProps: AriaListBoxOptions<object>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  controlWidth: number;
  controlHeight: number;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");
  const { popoverProps } = usePopover(
    { triggerRef, popoverRef, shouldUpdatePosition: false },
    { ...state, isOpen: state.isOpen && isPresent },
  );
  const { listBoxProps } = useListBox(menuProps, state, listboxRef);

  // Keep positioning in the scaled arcade coordinate system. React Aria owns
  // dismissal, focus, selection, and keyboard navigation.
  return (
    <FocusScope restoreFocus contain={isPresent}>
      <motion.div
        {...motionAriaProps(popoverProps)}
        ref={popoverRef}
        aria-hidden={!isPresent || undefined}
        inert={!isPresent}
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
          top: controlHeight + 6,
          zIndex: 30,
          boxSizing: "border-box",
          width: controlWidth,
          padding: 3,
          clipPath: controlOuterClip,
          background: "linear-gradient(145deg, #5df5ff, #718cff 48%, #ff4bc9)",
          filter:
            "drop-shadow(0 10px 14px rgba(0,0,0,.72)) drop-shadow(0 0 8px rgba(43,126,255,.65))",
          transformOrigin: "top center",
        }}
      >
        <DismissButton onDismiss={state.close} />
        <div
          {...listBoxProps}
          ref={listboxRef}
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
          {[...state.collection].map((item, index) => (
            <motion.span
              key={item.key}
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
                minHeight: 76 * controlScale,
                overflow: "visible",
              }}
            >
              <DropdownOption item={item} listState={state} />
            </motion.span>
          ))}
        </div>
        <DismissButton onDismiss={state.close} />
      </motion.div>
    </FocusScope>
  );
}

function DropdownOption({
  item,
  listState,
}: {
  item: Node<object>;
  listState: SelectState<object>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    optionProps,
    isSelected: selected,
    isFocused: active,
    isPressed,
  } = useOption({ key: item.key }, listState, ref);
  const reduceMotion = useReducedMotion();
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");
  const { state: interaction, handlers } = useInteraction({ isPressed });
  const state = { ...interaction, pressed: isPressed };

  return (
    <>
      <motion.div
        {...motionAriaProps(mergeProps(optionProps, handlers))}
        ref={ref}
        style={{
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          width: "100%",
          minHeight: 76 * controlScale,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          border: 0,
          outline: 0,
          padding: `${6 * controlScale}px ${20 * controlScale}px ${6 * controlScale}px ${25 * controlScale}px`,
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
          fontSize: 47 * fontScale,
          lineHeight: 1,
          textAlign: "left",
          textShadow: "2px 3px 0 #172747, 0 3px 5px #000",
          cursor: "pointer",
          transform: `scale(${state.pressed && !reduceMotion ? 0.965 : 1})`,
          filter: `${state.hovered ? "brightness(1.2)" : ""} var(--music-control-pulse-filter, brightness(1))`,
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
        <span style={{ position: "relative", zIndex: 1 }}>{item.rendered}</span>
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
      </motion.div>
      <ArcadeButtonEffect burstId={state.releaseCount} compact />
    </>
  );
}
