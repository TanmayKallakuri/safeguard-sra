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
 * Shared transitions
 * ------------------------------------------------------------------ */

export const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 260, damping: 30 } as const;
export const POP = { type: "spring", stiffness: 600, damping: 22, mass: 0.6 } as const;

/* ------------------------------------------------------------------ *
 * Page-load reveal: container stagger + child rise. Reduced motion
 * flattens to an instant, transform-free fade handled by gating below.
 * ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

// `hidden` is identical regardless of reduced-motion so the SSR markup is
// deterministic; reduced motion only flattens the transition (see `Rise`).
// The `show.transition` (SPRING) is intentionally overridden per-component:
// `Rise` passes `transition={flatTransition}` for reduced motion, which wins.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: SPRING },
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

/** A single staggered child that fades + rises in (or just fades if reduced). */
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
 * Count-up metric: animates a spring from 0 to `value`, rendering the
 * rounded number. Reduced motion snaps to the final value post-mount.
 *
 * Hydration-safe: the FIRST render is identical on the server and on every
 * client (reduced motion or not) — it always shows `0{suffix}`. We never
 * branch the rendered output on `useReducedMotion()` during render; the count
 * (or the instant snap) is driven from a `useEffect` after mount.
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
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 1 });
  // Deterministic first-paint text, identical on server + client.
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    // Always update via the spring's change subscription (asynchronous, so no
    // synchronous setState in the effect body). Reduced motion `jump`s the
    // spring straight to the target — one notification, no per-frame work.
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
 * Bar: animates scaleX 0 -> pct (transform-origin left), in-view.
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
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const target = Math.max(0, Math.min(1, pct / 100));

  // `initial` is a constant (`scaleX: 0`) so SSR markup is identical for every
  // client; reduced motion snaps to `target` via the zero-duration transition
  // applied post-mount, not in the server HTML.
  return (
    <div ref={ref} className="h-full w-full">
      <m.div
        className={className}
        style={{ originX: 0, height: "100%", width: "100%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView || reduce ? target : 0 }}
        transition={reduce ? { duration: 0 } : { ...SPRING_SOFT, delay }}
      />
    </div>
  );
}

