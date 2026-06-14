import { Slide } from "./types/slide";
import { isVideoUrl } from "./utils";

export type RevealUnit = { bulletIndex: number; mediaIndex: number };

export function revealPlan(slide: Slide): RevealUnit[] {
  const plan: RevealUnit[] = [];
  slide.bullets?.forEach((b, bi) => {
    if (typeof b !== "string" && b.media?.length) {
      b.media.forEach((_, mi) => plan.push({ bulletIndex: bi, mediaIndex: mi }));
    } else {
      plan.push({ bulletIndex: bi, mediaIndex: -1 });
    }
  });
  return plan;
}

export function stepCount(slide: Slide | undefined): number {
  if (!slide) return 1;
  if (slide.imagesMode === "step" && slide.images) return slide.images.length;
  if (slide.layout === "body" && !slide.revealAll) {
    return revealPlan(slide).length + 1 + (slide.flashback ? 1 : 0);
  }
  return 1;
}

export function resolveBulletMedia(
  slide: Slide,
  step: number,
  reveal: boolean,
  plan: RevealUnit[],
): { image?: string; video?: string } {
  if (slide.layout !== "body" || !slide.bullets) return {};

  let url: string | undefined;
  if (reveal) {
    const revealed = Math.min(plan.length, step);
    for (let k = revealed - 1; k >= 0; k--) {
      const { bulletIndex, mediaIndex } = plan[k];
      const b = slide.bullets[bulletIndex];
      if (typeof b === "string") continue;
      if (k === revealed - 1 && b.clearMedia) break;
      if (mediaIndex >= 0 && b.media) {
        url = b.media[mediaIndex];
        break;
      }
      if (b.image || b.video) {
        url = b.image ?? b.video;
        break;
      }
    }
  } else {
    for (let i = slide.bullets.length - 1; i >= 0; i--) {
      const b = slide.bullets[i];
      if (typeof b === "string") continue;
      if (b.media?.length) {
        url = b.media[b.media.length - 1];
        break;
      }
      if (b.image || b.video) {
        url = b.image ?? b.video;
        break;
      }
    }
  }

  if (!url) return {};
  return isVideoUrl(url) ? { video: url } : { image: url };
}
