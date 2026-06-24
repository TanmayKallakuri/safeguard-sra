"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Route transition. A fast (~180ms) crossfade with a small slide-up so moving
 * between Dashboard / Assess / Register / Report feels continuous, not a hard
 * cut. Templates remount per navigation, which re-runs this enter animation.
 *
 * Reduced motion → no transform, instant fade.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // `initial` must be identical on the server and on every client (reduced
  // motion or not) to avoid a hydration mismatch on this always-SSR'd wrapper.
  // We keep a constant `initial` and only flatten the *transition* (instant) for
  // reduced motion — the element snaps to its final state with no perceptible
  // movement, and the SSR markup is deterministic.
  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.16, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </m.div>
  );
}
