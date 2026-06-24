/**
 * Ambient module declarations for the Vanta FOG background.
 *
 * - `three@0.134.0` ships no bundled types and we deliberately do not install
 *   `@types/three` (those track a much newer three API than the pinned build,
 *   which would mismatch). We only pass the namespace through to Vanta, so an
 *   opaque module type is sufficient.
 * - `vanta` ships no types at all.
 */
declare module "three" {
  const THREE: unknown;
  export = THREE;
}

declare module "vanta/dist/vanta.fog.min" {
  interface VantaFogInstance {
    destroy: () => void;
    resize?: () => void;
    setOptions?: (opts: Record<string, unknown>) => void;
  }
  const FOG: (options: Record<string, unknown>) => VantaFogInstance;
  export default FOG;
}
