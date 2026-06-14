export const isVideoUrl = (u: string) => /\.(webm|mp4|mov|m4v)$/i.test(u);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface BadgeTitle {
  badge: string;
  rest: string;
}

export function parseBadgeTitle(title: string): BadgeTitle | null {
  const m = title.match(/^([A-Za-z]+(?:\s+\d+)?)\.\s+(.+)$/);
  return m ? { badge: m[1], rest: m[2] } : null;
}
