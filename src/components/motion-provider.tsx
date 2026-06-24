"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wraps the tree in LazyMotion so we can use the lightweight `m` components
 * everywhere and keep the animation bundle small (features are loaded once
 * here via `domAnimation`). All motion in the app uses `m.*`, never the full
 * `motion.*`, so the heavy feature bundle is never pulled in.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
