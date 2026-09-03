// Motion reserves these event names for animation/gesture callbacks. None of
// our Aria controls uses native drag or animation callbacks; keep its other
// DOM handlers intact when spreading them onto animated elements.
export function motionAriaProps<
  T extends {
    onDrag?: unknown;
    onDragStart?: unknown;
    onDragEnd?: unknown;
    onAnimationStart?: unknown;
  },
>(props: T) {
  const result = { ...props };
  delete result.onDrag;
  delete result.onDragStart;
  delete result.onDragEnd;
  delete result.onAnimationStart;
  return result as Omit<T, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">;
}
