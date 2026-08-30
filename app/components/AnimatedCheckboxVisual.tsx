"use client";

import { AnimatePresence, motion } from "framer-motion";

const restingShadow = "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff";

const frameVariants = {
  checked: {
    scale: [1, 0.9, 1.08, 1],
    borderColor: ["#4ba3ff", "#8bfbff", "#62ccff", "#4ba3ff"],
    boxShadow: [
      restingShadow,
      "inset 0 0 20px #02091a, 0 0 27px #25d9ff, 0 0 14px #a15eff",
      "inset 0 0 16px #000, 0 0 16px #2a9dff, 0 0 9px #72f8ff",
      restingShadow,
    ],
    transition: { duration: 0.46, times: [0, 0.2, 0.62, 1] },
  },
  unchecked: {
    scale: [1, 0.92, 1],
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
          <>
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.25, rotate: -22 }}
              animate={{
                opacity: 1,
                scale: [0.25, 1.25, 0.92, 1],
                rotate: [-22, 8, -3, 0],
              }}
              exit={{ opacity: 0, scale: 0.3, rotate: 18 }}
              transition={{ duration: 0.4, times: [0, 0.5, 0.78, 1] }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 50,
                height: 44,
                clipPath: "polygon(0 47%, 14% 32%, 35% 58%, 85% 0, 100% 14%, 35% 100%)",
                background: "#61f1ff",
                filter: "drop-shadow(0 0 7px #128dff)",
                translateX: "-50%",
                translateY: "-50%",
              }}
            />
            <motion.span
              key="pulse"
              initial={{ opacity: 0.75, scale: 0.72 }}
              animate={{ opacity: 0, scale: 1.38 }}
              transition={{ duration: 0.48, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: -7,
                border: "3px solid #61f1ff",
                borderRadius: 15,
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
