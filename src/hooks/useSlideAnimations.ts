import { RefObject, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { Slide } from "../types/slide";
import { RevealUnit } from "../reveal";
import { prefersReducedMotion } from "../utils";

const EASE = {
  enter: "power1.out",
  flashIn: "power3.in",
  flashOut: "expo.out",
  step: "power2.out",
};

interface EntranceStep {
  selector: string;
  vars: gsap.TweenVars;
  at: number;
}

const ENTRANCE: EntranceStep[] = [
  { selector: ".eyebrow, .slide__badge", vars: { opacity: 0, y: 6, duration: 0.5 }, at: 0 },
  {
    selector: ".slide__sub, .slide__body, .slide__emphasize",
    vars: { opacity: 0, y: 6, duration: 0.5 },
    at: 0.2,
  },
  {
    selector: ".slide__media-col, .slide__images--fill",
    vars: { opacity: 0, y: 8, duration: 0.55 },
    at: 0.15,
  },
  {
    selector: ".bullets > .bullet",
    vars: { opacity: 0, y: 8, duration: 0.4, stagger: { amount: 0.18 } },
    at: 0.25,
  },
];

const FLASHBACK = {
  veilIn: { opacity: 1, duration: 0.85, ease: EASE.flashIn },
  contentBlur: { filter: "blur(7px)", scale: 1.012, duration: 0.85, ease: EASE.flashIn },
  contentHeld: { filter: "blur(7px)", scale: 1.009 },
  hold: 0.3,
  veilOut: { opacity: 0, duration: 0.95, ease: EASE.flashOut },
  contentRestore: { filter: "blur(0px)", scale: 1, duration: 1.1, ease: EASE.flashOut },
};

const STEP_REVEAL: gsap.TweenVars = { opacity: 0, y: 8, duration: 0.3, ease: EASE.step };
const BULLET_MEDIA: gsap.TweenVars = { opacity: 0, duration: 0.25, ease: EASE.step };

interface Options {
  rootRef: RefObject<HTMLDivElement>;
  slide: Slide;
  step: number;
  plan: RevealUnit[];
  flashed: boolean;
  bulletMediaKey?: string;
}

export function useSlideAnimations({
  rootRef,
  slide,
  step,
  plan,
  flashed,
  bulletMediaKey,
}: Options) {
  const [swapped, setSwapped] = useState(false);

  useLayoutEffect(function playEntrance() {
    const root = rootRef.current;
    if (!root || slide.layout !== "body" || prefersReducedMotion()) return;

    const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
    for (const { selector, vars, at } of ENTRANCE) {
      const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
      if (els.length) tl.from(els, { ...vars }, at);
    }

    return () => {
      tl.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(
    function playFlashback() {
      const root = rootRef.current;
      if (!flashed) {
        setSwapped(false);
        return;
      }
      const veil = root?.querySelector<HTMLElement>(".slide__flashback-veil");
      const content = root?.querySelector<HTMLElement>(".slide__content");
      if (!veil || prefersReducedMotion()) {
        setSwapped(true);
        return;
      }
      let cancelled = false;
      const tl = gsap.timeline();
      tl.fromTo(veil, { opacity: 0 }, { ...FLASHBACK.veilIn }, 0);
      if (content) {
        tl.fromTo(content, { filter: "blur(0px)", scale: 1 }, { ...FLASHBACK.contentBlur }, 0);
      }
      tl.add(() => {
        if (!cancelled) setSwapped(true);
      });
      if (content) tl.set(content, { ...FLASHBACK.contentHeld });
      tl.to({}, { duration: FLASHBACK.hold }).to(veil, { ...FLASHBACK.veilOut });
      if (content) tl.to(content, { ...FLASHBACK.contentRestore }, "<");
      return () => {
        cancelled = true;
        tl.revert();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flashed],
  );

  useLayoutEffect(
    function revealStep() {
      const root = rootRef.current;
      if (!root || slide.layout !== "body" || step === 0 || flashed || prefersReducedMotion())
        return;

      const revealed = Math.min(plan.length, step);
      if (revealed >= 2 && plan[revealed - 1].bulletIndex === plan[revealed - 2].bulletIndex)
        return;

      const bullets = Array.from(root.querySelectorAll<HTMLElement>(".bullets > .bullet"));
      const targets: HTMLElement[] = [];
      const last = bullets[bullets.length - 1];
      if (last) targets.push(last);
      const emph = root.querySelector<HTMLElement>(".slide__emphasize");
      if (emph) targets.push(emph);
      if (!targets.length) return;
      const tween = gsap.from(targets, { ...STEP_REVEAL });
      return () => {
        tween.revert();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, slide.layout, flashed],
  );

  useLayoutEffect(
    function fadeBulletMedia() {
      const root = rootRef.current;
      if (!root || !bulletMediaKey || prefersReducedMotion()) return;
      const el = root.querySelector<HTMLElement>(".slide__bullet-media");
      if (!el) return;
      const tween = gsap.from(el, { ...BULLET_MEDIA });
      return () => {
        tween.revert();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bulletMediaKey],
  );

  return { swapped };
}
