"use client";

import {
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Shared transitions — instrument-like: crisp tweens, not bouncy springs.
 * ------------------------------------------------------------------ */

// Fast, near-linear ease (mechanical). Used for entrances and indicators.
export const CRISP = { duration: 0.18, ease: [0.2, 0, 0, 1] } as const;
// Slightly snappier for the sliding active-tab indicator.
export const SLIDE = { duration: 0.22, ease: [0.2, 0, 0, 1] } as const;
// Quick bar fill — near-linear.
export const FILL = { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } as const;

/* ------------------------------------------------------------------ *
 * Page-load reveal: tight container stagger + crisp child rise.
 * ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035, delayChildren: 0.01 },
  },
};

// `hidden` is identical regardless of reduced-motion so SSR markup is
// deterministic; reduced motion only flattens the transition (see `Rise`).
// `show.transition` (CRISP) is intentionally overridden per-component when
// `Rise` passes `transition={flatTransition}` for reduced motion.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: CRISP },
};

const flatTransition = { duration: 0 } as const;

/**
 * Staggered entrance wrapper. Children should be `<Rise>` elements.
 * Cap callers to <=20 children to keep stagger snappy.
 */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
}) {
  const MComp = m[as];
  return (
    <MComp
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </MComp>
  );
}

/** A single staggered child that fades + rises (or just appears, if reduced). */
export function Rise({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const MComp = m[as];
  return (
    <MComp
      className={className}
      variants={itemVariants}
      transition={reduce ? flatTransition : undefined}
    >
      {children}
    </MComp>
  );
}

/* ------------------------------------------------------------------ *
 * Count-up metric: odometer-style tick from 0 to `value`.
 *
 * Hydration-safe: the FIRST render is identical on the server and every client
 * (reduced motion or not) — it always shows `0{suffix}`. We never branch the
 * rendered output on `useReducedMotion()` during render; the count (or the
 * instant snap) is driven from a `useEffect` after mount.
 * ------------------------------------------------------------------ */

export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  // Stiff, well-damped spring reads like a fast counter/odometer, not a bounce.
  const spring = useSpring(mv, { stiffness: 140, damping: 26, mass: 0.8 });
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    // Async change subscription (no synchronous setState in the effect body).
    const unsubscribe = spring.on("change", (v) =>
      setDisplay(`${Math.round(v)}${suffix}`),
    );
    if (reduce) {
      spring.jump(value);
    } else {
      mv.set(value);
    }
    return unsubscribe;
  }, [value, suffix, reduce, mv, spring]);

  return <span className={className}>{display}</span>;
}

/* ------------------------------------------------------------------ *
 * Bar: animates scaleX 0 -> pct (transform-origin left), in-view, quick.
 * Never animates width.
 * ------------------------------------------------------------------ */

export function GrowBar({
  pct,
  className,
  delay = 0,
}: {
  pct: number;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const target = Math.max(0, Math.min(1, pct / 100));

  // Constant `initial` (scaleX:0) keeps SSR markup identical for every client;
  // reduced motion snaps to target via the zero-duration transition post-mount.
  return (
    <div ref={ref} className="h-full w-full">
      <m.div
        className={className}
        style={{ originX: 0, height: "100%", width: "100%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView || reduce ? target : 0 }}
        transition={reduce ? { duration: 0 } : { ...FILL, delay }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Cell populate: a fast, tight opacity+scale tick for heatmap cells.
 * Used inside a Stagger so cells "boot up" in sequence.
 * ------------------------------------------------------------------ */

const cellVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.16, ease: [0.2, 0, 0, 1] } },
};

export function Cell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      variants={cellVariants}
      transition={reduce ? flatTransition : undefined}
    >
      {children}
    </m.div>
  );
}
