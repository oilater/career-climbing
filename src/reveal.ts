import { Slide, Bullet } from "./types/slide";
import { isVideoUrl } from "./utils";

export type RevealUnit = { bulletIndex: number; mediaIndex: number };

export interface VisibleContent {
  visibleBullets?: Bullet[];
  showEmphasize: boolean;
  displayTitle?: string;
}

export function resolveVisibleContent(
  slide: Slide,
  step: number,
  plan: RevealUnit[],
  swapped: boolean,
): VisibleContent {
  const reveal = !slide.revealAll;
  const revealUnitCount = plan.length;

  let visibleBullets = slide.bullets;
  if (slide.layout === "body" && slide.bullets && reveal) {
    const revealed = Math.min(plan.length, step);
    const visibleBulletCount = revealed === 0 ? 0 : plan[revealed - 1].bulletIndex + 1;
    visibleBullets = slide.bullets.slice(0, visibleBulletCount);
  }
  if (swapped && slide.flashback?.lastBullet && visibleBullets?.length) {
    const lastIndex = visibleBullets.length - 1;
    visibleBullets = visibleBullets.map((bullet, index) =>
      index === lastIndex ? slide.flashback!.lastBullet! : bullet,
    );
  }

  const showEmphasize = !!slide.emphasize && (!reveal || step >= revealUnitCount);
  const displayTitle = swapped && slide.flashback ? slide.flashback.title : slide.title;

  return { visibleBullets, showEmphasize, displayTitle };
}

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
