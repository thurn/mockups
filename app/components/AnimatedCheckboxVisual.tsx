"use client";

import { AnimatePresence, motion } from "framer-motion";

const restingShadow = "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff";

const frameVariants = {
  checked: {
    borderColor: ["#4ba3ff", "#8bfbff", "#4ba3ff"],
    boxShadow: [
      restingShadow,
      "inset 0 0 17px #02091a, 0 0 18px #25d9ff, 0 0 9px #a15eff",
      restingShadow,
    ],
    transition: { duration: 0.4, times: [0, 0.45, 1] },
  },
  unchecked: {
    borderColor: ["#4ba3ff", "#315d9d", "#4ba3ff"],
    boxShadow: [restingShadow, "inset 0 0 16px #000, 0 0 5px #166cff", restingShadow],
    transition: { duration: 0.3, times: [0, 0.4, 1] },
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
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 54,
              height: 46,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.span
              key="short-stroke"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { duration: 0.16, ease: "easeInOut" },
              }}
              exit={{
                scaleX: 0,
                transition: { duration: 0.13, delay: 0.18, ease: "easeInOut" },
              }}
              style={{
                position: "absolute",
                left: 1,
                top: 18,
                width: 22,
                height: 8,
                borderRadius: 4,
                background: "#61f1ff",
                filter: "drop-shadow(0 0 7px #128dff)",
                rotate: 45,
                transformOrigin: "left center",
              }}
            />
            <motion.span
              key="long-stroke"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { duration: 0.24, delay: 0.13, ease: "easeInOut" },
              }}
              exit={{
                scaleX: 0,
                transition: { duration: 0.18, ease: "easeInOut" },
              }}
              style={{
                position: "absolute",
                left: 16,
                top: 33,
                width: 46,
                height: 8,
                borderRadius: 4,
                background: "#61f1ff",
                filter: "drop-shadow(0 0 7px #128dff)",
                rotate: -43,
                transformOrigin: "left center",
              }}
            />
          </span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
