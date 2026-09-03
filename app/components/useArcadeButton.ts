"use client";

import { useRef, type RefObject } from "react";
import { mergeProps, useButton, type AriaButtonProps } from "react-aria";
import { useInteraction } from "./useInteraction";

export function useArcadeButton(
  props: AriaButtonProps = {},
  forwardedRef?: RefObject<HTMLButtonElement | null>,
) {
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = forwardedRef ?? localRef;
  const { state, handlers, pressProps } = useInteraction({ isDisabled: props.isDisabled });
  const { buttonProps, isPressed } = useButton(mergeProps(pressProps, props), ref);
  return {
    ref,
    state: { ...state, pressed: isPressed },
    buttonProps: mergeProps(buttonProps, handlers),
  };
}
