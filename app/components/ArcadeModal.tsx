"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { actionInnerClip, actionOuterClip, ClippedInset } from "./ClippedInset";
import { displayFont } from "./styles";

const modalClip = "polygon(5% 0, 95% 0, 100% 8%, 100% 92%, 95% 100%, 5% 100%, 0 92%, 0 8%)";

export function ArcadeModal({
  open,
  title,
  ariaLabel,
  children,
  confirmLabel = "OK",
  cancelLabel,
  danger = false,
  closeOnEscape = true,
  reduceMotion,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  closeOnEscape?: boolean;
  reduceMotion: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => initialFocusRef.current?.focus(), 80);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [closeOnEscape, onClose, open]);

  const duration = reduceMotion ? 0.01 : 0.42;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="arcade-modal-backdrop"
          data-testid="arcade-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          style={{
            position: "absolute",
            zIndex: 60,
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: "0 75px 80px",
            background:
              "radial-gradient(circle at 50% 48%, rgba(18,61,129,.24), transparent 42%), rgba(0,2,10,.79)",
            backdropFilter: "blur(3px)",
          }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ? undefined : ariaLabel}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={descriptionId}
            data-testid="arcade-modal"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scaleX: 0.72, scaleY: 0.04, x: -30, skewX: -7, filter: "blur(5px)" }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: [0, 1, 0.72, 1],
                    scaleX: [0.72, 1.04, 0.985, 1],
                    scaleY: [0.04, 1.08, 0.97, 1],
                    x: [-30, 18, -7, 0],
                    skewX: [-7, 2.5, -1, 0],
                    filter: ["blur(5px)", "blur(0px)", "brightness(1.7)", "brightness(1)"],
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: [1, 0.8, 0],
                    scaleX: [1, 1.07, 0.78],
                    scaleY: [1, 0.82, 0.035],
                    x: [0, -18, 34],
                    skewX: [0, -3, 8],
                    filter: ["brightness(1)", "brightness(2)", "blur(5px)"],
                  }
            }
            transition={{
              duration,
              times: reduceMotion ? undefined : [0, 0.48, 0.72, 1],
              ease: "easeOut",
            }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 790,
              minHeight: 500,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "74px 70px 62px",
              clipPath: modalClip,
              border: "5px solid #5cecff",
              color: "#f7fbff",
              background:
                "radial-gradient(ellipse at 50% 18%, rgba(18,112,212,.27), transparent 43%), linear-gradient(145deg, #071a3a, #020817 58%, #180622)",
              boxShadow:
                "inset 0 0 0 3px #133f78, inset 0 0 58px #000, 0 0 11px #aafaff, 0 0 34px #167dff, 0 0 55px rgba(255,52,202,.48)",
              transformOrigin: "center center",
            }}
          >
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? undefined : { x: ["-115%", "115%"] }}
              transition={{ duration: 1.8, ease: "linear", repeat: Infinity, repeatDelay: 1.2 }}
              style={{
                position: "absolute",
                zIndex: 0,
                top: 0,
                bottom: 0,
                width: 165,
                background:
                  "linear-gradient(90deg, transparent, rgba(104,241,255,.08), rgba(255,106,222,.12), transparent)",
                transform: "skewX(-16deg)",
                pointerEvents: "none",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                zIndex: 0,
                inset: 0,
                opacity: 0.18,
                background:
                  "repeating-linear-gradient(180deg, transparent 0 7px, rgba(113,230,255,.15) 8px, transparent 9px)",
                pointerEvents: "none",
              }}
            />
            {title && (
              <div
                id={titleId}
                style={{
                  position: "relative",
                  zIndex: 1,
                  color: danger ? "#ff496b" : "#6eeeff",
                  fontFamily: displayFont,
                  fontSize: 86,
                  lineHeight: 0.9,
                  letterSpacing: 3,
                  textAlign: "center",
                  textTransform: "uppercase",
                  textShadow: danger
                    ? "3px 5px 0 #3a0719, 0 0 18px rgba(255,37,93,.76)"
                    : "3px 5px 0 #102c5b, 0 0 18px rgba(57,221,255,.72)",
                }}
              >
                {title}
              </div>
            )}
            <div
              id={descriptionId}
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: 620,
                marginTop: title ? 42 : 0,
                color: "#f5f7ff",
                fontFamily: "'Barlow Condensed', Impact, sans-serif",
                fontSize: 47,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: 0.7,
                textAlign: "center",
                textTransform: "uppercase",
                textShadow: "2px 3px 0 #101a35, 0 3px 7px #000",
              }}
            >
              {children}
            </div>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: 28,
                marginTop: 58,
              }}
            >
              {cancelLabel && (
                <ModalButton buttonRef={initialFocusRef} label={cancelLabel} onClick={onClose} />
              )}
              <ModalButton
                buttonRef={cancelLabel ? undefined : initialFocusRef}
                danger={danger}
                label={confirmLabel}
                onClick={onConfirm}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalButton({
  label,
  danger = false,
  buttonRef,
  onClick,
}: {
  label: string;
  danger?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        width: 250,
        height: 94,
        display: "grid",
        placeItems: "center",
        padding: 0,
        border: 0,
        outline: 0,
        clipPath: actionOuterClip,
        color: danger ? "#ff4b69" : "#eafbff",
        background: danger
          ? "linear-gradient(110deg, #ff6a81, #ff2454 56%, #ff77a4)"
          : "linear-gradient(110deg, #74f5ff, #3994ff 55%, #ff5bd1)",
        filter: danger
          ? "drop-shadow(0 0 11px rgba(255,31,91,.75))"
          : "drop-shadow(0 0 11px rgba(47,205,255,.65))",
        fontFamily: displayFont,
        fontSize: 56,
        lineHeight: 1,
        letterSpacing: 1.5,
        textShadow: "2px 4px 0 #14224a, 0 4px 7px #000",
        cursor: "pointer",
      }}
    >
      <ClippedInset
        inset={4}
        clipPath={actionInnerClip}
        background="linear-gradient(180deg, #08172f, #020713)"
        boxShadow="inset 0 0 22px #000"
      />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </button>
  );
}
