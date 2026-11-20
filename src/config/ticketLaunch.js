export const ticketLaunchAt = '2026-11-21T08:15:00+05:30';
export const ticketLaunchLabel = '21 November 2026 · 8:15 AM IST';

export function ticketLaunchRemaining(now = Date.now()) {
  return Math.max(0, Date.parse(ticketLaunchAt) - now);
}
