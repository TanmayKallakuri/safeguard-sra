/**
 * Format an ISO timestamp into a stable, locale-independent date string.
 *
 * We deliberately avoid `toLocaleDateString()` for any text rendered during the
 * first paint — locale/timezone differences between server and client can cause
 * hydration mismatches. Components that show dates call this from a client-only
 * path (after the mounted guard) but the fixed format keeps it predictable.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** True when the timestamp is the empty-assessment sentinel (never saved). */
export function isUnsavedStamp(iso: string): boolean {
  return iso === "1970-01-01T00:00:00.000Z" || Number.isNaN(new Date(iso).getTime());
}
