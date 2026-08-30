"use client";

import { AnimatePresence, motion } from "framer-motion";

const restingShadow = "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff";
const checkedShadow = "inset 0 0 15px #000, 0 0 13px #168dff, 0 0 7px #6af6ff";

const frameVariants = {
  checked: {
    borderColor: "#62cfff",
    boxShadow: checkedShadow,
    transition: { duration: 0.12 },
  },
  unchecked: {
    borderColor: "#4ba3ff",
    boxShadow: restingShadow,
    transition: { duration: 0.12 },
  },
};

export function AnimatedCheckboxVisual({ checked }: { checked: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      animate={checked ? "checked" : "unchecked"}
      variants={frameVariants}
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: 77,
        height: 77,
        border: "4px solid #4ba3ff",
        borderRadius: 11,
        background: "linear-gradient(180deg, #06142b, #02091a)",
        boxShadow: restingShadow,
      }}
    >
      <AnimatePresence initial={false}>
        {checked && (
          <motion.svg
            key="traced-check"
            viewBox="0 0 56 48"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 56,
              height: 48,
              overflow: "visible",
              transform: "translate(-50%, -50%)",
              filter: "drop-shadow(0 0 7px #128dff)",
            }}
          >
            <motion.path
              d="M 6 24 L 20 37 L 50 7"
              fill="none"
              stroke="#61f1ff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration: 0.24, ease: "easeOut" },
                  opacity: { duration: 0.01 },
                },
              }}
              exit={{
                pathLength: 0,
                opacity: 0,
                transition: {
                  pathLength: { duration: 0.16, ease: "easeIn" },
                  opacity: { duration: 0.04, delay: 0.11 },
                },
              }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
