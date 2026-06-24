"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated Vanta.js FOG background, fixed behind everything.
 *
 * - Client-only: three.js + the Vanta FOG build are dynamically imported inside
 *   a `useEffect`, so nothing touches `window` during SSR.
 * - Reduced motion: Vanta has no static mode, so when the user prefers reduced
 *   motion we never init it — instead a static CSS gradient approximating the
 *   fog palette is shown (rendered identically on server and client, so no
 *   hydration mismatch).
 * - Print: hidden via the `.vanta-bg` / `.fog-fallback` print rules in CSS.
 *
 * Pinned to three@0.134.0, the known-good version for Vanta effects.
 */

// Vanta FOG default-ish palette tuned to the brief.
const FOG_OPTIONS = {
  highlightColor: 0xffc300,
  midtoneColor: 0xff1f00,
  lowlightColor: 0x2d00ff,
  baseColor: 0xffebeb,
  blurFactor: 0.6,
  speed: 1.0,
  zoom: 1.0,
} as const;

interface VantaEffect {
  destroy: () => void;
  resize?: () => void;
}

export function VantaFog() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<VantaEffect | null>(null);
  // First render is deterministic on server + client: assume motion is allowed
  // (no fallback). We only flip to the static fallback after mount once we know
  // the user prefers reduced motion — and we never init Vanta in that case.
  const [staticFallback, setStaticFallback] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setStaticFallback(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [THREE, fogModule] = await Promise.all([
          import("three"),
          // The Vanta FOG build attaches FOG as a default export.
          import("vanta/dist/vanta.fog.min"),
        ]);
        if (cancelled || !elRef.current) return;

        const FOG = (fogModule.default ?? fogModule) as (
          opts: Record<string, unknown>,
        ) => VantaEffect;

        effectRef.current = FOG({
          el: elRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          ...FOG_OPTIONS,
        });
      } catch {
        // WebGL unavailable or the effect failed to init — degrade to the
        // static gradient so there is never a blank/broken background.
        if (!cancelled) setStaticFallback(true);
      }
    })();

    return () => {
      cancelled = true;
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Vanta mounts its canvas as a child of this fixed full-viewport div. */}
      <div ref={elRef} className="vanta-bg" aria-hidden="true" />
      {/* Static fog-approximating gradient: always in the DOM (so SSR/client
          markup match) but only visible when `.is-static` is toggled on. */}
      <div
        className={`fog-fallback${staticFallback ? " is-static" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
