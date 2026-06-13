import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Bullet, Slide } from "../types/slide";
import { MountainBackdrop, MountainLogo } from "./MountainBackdrop";

interface Props {
  slide: Slide;
  part?: string;
  step?: number;
}

function SplitChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) =>
        ch === "\n" ? (
          <br key={i} />
        ) : (
          <span key={i} className="ce-char" aria-hidden="true">
            {ch === " " ? " " : ch}
          </span>
        )
      )}
    </>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isVideoUrl = (u: string) => /\.(webm|mp4|mov|m4v)$/i.test(u);

export function SlideView({ slide, part, step = 0 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reveal = !slide.revealAll;

  // Each bullet reveals in one step, except a bullet with a `media` array,
  // which reveals its media one item per step (space advances within it).
  const plan: { bulletIndex: number; mediaIndex: number }[] = [];
  slide.bullets?.forEach((b, bi) => {
    if (typeof b !== "string" && b.media?.length) {
      b.media.forEach((_, mi) => plan.push({ bulletIndex: bi, mediaIndex: mi }));
    } else {
      plan.push({ bulletIndex: bi, mediaIndex: -1 });
    }
  });
  const revealUnitCount = plan.length;
  const flashed = !!slide.flashback && reveal && step > revealUnitCount;
  const [swapped, setSwapped] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || slide.layout !== "body" || prefersReducedMotion()) return;

    const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
    const tl = gsap.timeline({ defaults: { ease: "power1.out" } });
    const add = (els: HTMLElement[], vars: gsap.TweenVars, at?: number | string) => {
      if (els.length) tl.from(els, vars, at);
    };

    add(q(".eyebrow, .slide__badge"), { opacity: 0, y: 6, duration: 0.5 }, 0);
    add(q(".slide__sub, .slide__body, .slide__emphasize"), { opacity: 0, y: 6, duration: 0.5 }, 0.2);
    add(q(".slide__media-col, .slide__images--fill"), { opacity: 0, y: 8, duration: 0.55 }, 0.15);
    add(
      q(".bullets > .bullet"),
      { opacity: 0, y: 8, duration: 0.4, stagger: { amount: 0.18 } },
      0.25
    );

    return () => {
      tl.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
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
    const tl = gsap.timeline();
    tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.85, ease: "power3.in" }, 0);
    if (content) {
      tl.fromTo(
        content,
        { filter: "blur(0px)", scale: 1 },
        { filter: "blur(7px)", scale: 1.012, duration: 0.85, ease: "power3.in" },
        0
      );
    }
    tl.add(() => setSwapped(true));
    if (content) tl.set(content, { filter: "blur(7px)", scale: 1.009 });
    tl.to({}, { duration: 0.3 }).to(veil, {
      opacity: 0,
      duration: 0.95,
      ease: "expo.out",
    });
    if (content)
      tl.to(
        content,
        { filter: "blur(0px)", scale: 1, duration: 1.1, ease: "expo.out" },
        "<"
      );
    return () => {
      tl.revert();
    };
  }, [flashed]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || slide.layout !== "body" || step === 0 || flashed || prefersReducedMotion())
      return;

    // When the step only advances media within the same bullet, leave the
    // text line alone — only the side media should swap.
    const revealed = Math.min(plan.length, step);
    if (
      revealed >= 2 &&
      plan[revealed - 1].bulletIndex === plan[revealed - 2].bulletIndex
    )
      return;

    const bullets = Array.from(
      root.querySelectorAll<HTMLElement>(".bullets > .bullet")
    );
    const targets: HTMLElement[] = [];
    const last = bullets[bullets.length - 1];
    if (last) targets.push(last);
    const emph = root.querySelector<HTMLElement>(".slide__emphasize");
    if (emph) targets.push(emph);
    if (!targets.length) return;
    const tween = gsap.from(targets, {
      opacity: 0,
      y: 8,
      duration: 0.3,
      ease: "power2.out",
    });
    return () => {
      tween.revert();
    };
  }, [step, slide.layout, flashed]);

  let bulletImage: string | undefined;
  let bulletVideo: string | undefined;
  if (slide.layout === "body" && slide.bullets) {
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
    if (url) {
      if (isVideoUrl(url)) bulletVideo = url;
      else bulletImage = url;
    }
  }
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || (!bulletImage && !bulletVideo) || prefersReducedMotion())
      return;
    const el = root.querySelector<HTMLElement>(".slide__bullet-media");
    if (!el) return;
    const tween = gsap.from(el, { opacity: 0, duration: 0.25, ease: "power2.out" });
    return () => {
      tween.revert();
    };
  }, [bulletImage, bulletVideo]);

  if (slide.layout === "cover") {
    return (
      <div className="slide slide--cover">
        <MountainBackdrop />
        <div className="cover">
          <div className="cover__top">
            {slide.eyebrow && (
              <div className="cover__brand">
                <MountainLogo size={30} />
                <span>{slide.eyebrow}</span>
              </div>
            )}
            <h1 className="cover__title">{slide.title}</h1>
          </div>
          {slide.subtitle && <p className="cover__sub">{slide.subtitle}</p>}
        </div>
      </div>
    );
  }

  const hasText = !!(
    slide.eyebrow ||
    slide.title ||
    slide.subtitle ||
    slide.body ||
    (slide.bullets && slide.bullets.length > 0) ||
    slide.emphasize
  );
  const hasImages = !!(slide.images && slide.images.length > 0);
  const isStepMode = hasImages && slide.imagesMode === "step";
  const safeStep = isStepMode
    ? Math.max(0, Math.min(step, slide.images!.length - 1))
    : 0;
  const effectiveImages: string[] | undefined = isStepMode
    ? [slide.images![safeStep]]
    : slide.images;
  const imagesRight = hasImages && slide.imagesPosition === "right";

  if (hasImages && !hasText && !imagesRight) {
    return (
      <div
        className={`slide slide--${slide.layout}${
          slide.imagesLarge ? " slide--media-fill" : ""
        }`}
        ref={rootRef}
      >
        <MountainBackdrop />
        {part && <div className="slide__part">{part}</div>}
        <div className="slide__images slide__images--fill">
          {effectiveImages!.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="slide__images-item slide__images-item--fill"
            />
          ))}
        </div>
      </div>
    );
  }

  let visibleBullets = slide.bullets;
  if (slide.layout === "body" && slide.bullets && reveal) {
    const revealed = Math.min(plan.length, step);
    const count = revealed === 0 ? 0 : plan[revealed - 1].bulletIndex + 1;
    visibleBullets = slide.bullets.slice(0, count);
  }
  if (swapped && slide.flashback?.lastBullet && visibleBullets?.length) {
    const lastIdx = visibleBullets.length - 1;
    visibleBullets = visibleBullets.map((b, i) =>
      i === lastIdx ? slide.flashback!.lastBullet! : b
    );
  }
  const showEmphasize = !!slide.emphasize && (!reveal || step >= revealUnitCount);
  const slideHasBulletMedia = !!slide.bullets?.some(
    (b) => typeof b !== "string" && (!!b.image || !!b.video || !!b.media?.length)
  );

  const videoRight = !!slide.video && slide.videoPosition === "right";
  const imageRight = !!slide.image && slide.imagePosition === "right";
  const hasRight =
    videoRight || imageRight || imagesRight || slideHasBulletMedia || !!slide.flashback;

  const displayTitle =
    swapped && slide.flashback ? slide.flashback.title : slide.title;

  const videoLoop = slide.videoMode === "loop";
  const videoEl = slide.video && (
    <video
      className={`slide__video slide__video--${videoRight ? "right" : "center"}`}
      src={slide.video}
      controls={!videoLoop}
      autoPlay={videoLoop}
      loop={videoLoop}
      muted={videoLoop}
      preload={videoLoop ? "auto" : "metadata"}
      playsInline
    />
  );

  const imageEl = slide.image && (
    <img
      className={`slide__image slide__image--${imageRight ? "right" : "center"}`}
      src={slide.image}
      alt=""
    />
  );

  const badgeMatch = displayTitle?.match(/^([A-Za-z]+(?:\s+\d+)?)\.\s+(.+)$/);
  const badgeKind = badgeMatch ? badgeMatch[1].split(/\s+/)[0].toLowerCase() : "";
  const splitTitle = slide.layout === "body";

  const text = (
    <>
      {slide.eyebrow && <div className="eyebrow">{slide.eyebrow}</div>}
      {displayTitle &&
        (badgeMatch ? (
          <div className="slide__heading">
            <span className={`slide__badge slide__badge--${badgeKind}`}>
              {badgeMatch[1]}
            </span>
            <h1 className="slide__title" aria-label={badgeMatch[2]}>
              {splitTitle ? <SplitChars text={badgeMatch[2]} /> : badgeMatch[2]}
            </h1>
          </div>
        ) : (
          <h1 className="slide__title" aria-label={displayTitle}>
            {splitTitle ? <SplitChars text={displayTitle} /> : displayTitle}
          </h1>
        ))}
      {slide.subtitle && <p className="slide__sub">{slide.subtitle}</p>}
      {slide.body && <p className="slide__body">{slide.body}</p>}
      {!videoRight && videoEl}
      {visibleBullets && (
        <BulletList items={visibleBullets} style={slide.bulletStyle ?? "dash"} />
      )}
      {showEmphasize && (
        <p className="slide__emphasize">→ {slide.emphasize}</p>
      )}
      {!imageRight && imageEl}
      {hasImages && !imagesRight && (
        <div className={`slide__images ${isStepMode ? "slide__images--step" : ""}`}>
          {effectiveImages!.map((src, i) => (
            <img key={src + i} src={src} alt="" className="slide__images-item" />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div
      className={`slide slide--${slide.layout}${
        slide.imagesLarge ? " slide--media-lg" : ""
      }`}
      ref={rootRef}
    >
      <MountainBackdrop />
      {slide.flashback && (
        <div className="slide__flashback-veil" aria-hidden="true" />
      )}
      {part && <div className="slide__part">{part}</div>}
      {hasRight ? (
        <div className="slide__content slide__content--row">
          <div className="slide__text">{text}</div>
          <div
            className={`slide__media-col${
              slide.imagesLarge ? " slide__media-col--wide" : ""
            }`}
          >
            {videoRight && videoEl}
            {imageRight && imageEl}
            {swapped && slide.flashback && (
              <video
                key={slide.flashback.video}
                src={slide.flashback.video}
                className="slide__images-stack slide__flashback-video"
                controls
                preload="metadata"
                playsInline
              />
            )}
            {imagesRight &&
              effectiveImages!.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt=""
                  className="slide__images-stack"
                />
              ))}
            {bulletVideo ? (
              <video
                key={bulletVideo}
                src={bulletVideo}
                className="slide__images-stack slide__bullet-media"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              bulletImage && (
                <img
                  key={bulletImage}
                  src={bulletImage}
                  alt=""
                  className="slide__images-stack slide__bullet-media"
                />
              )
            )}
          </div>
        </div>
      ) : (
        <div className="slide__content">{text}</div>
      )}
    </div>
  );
}

function BulletList({
  items,
  style,
  depth = 0,
}: {
  items: Bullet[];
  style: "dash" | "number";
  depth?: number;
}) {
  const Tag = style === "number" && depth === 0 ? "ol" : "ul";
  return (
    <Tag className={`bullets bullets--${style} bullets--depth-${depth}`}>
      {items.map((item, i) => {
        if (typeof item === "string") {
          return (
            <li key={i} className="bullet">
              {item}
            </li>
          );
        }
        return (
          <li key={i} className="bullet">
            <span>{item.text}</span>
            {item.hint && <span className="bullet__hint"> — {item.hint}</span>}
            {item.children && (
              <BulletList items={item.children} style="dash" depth={depth + 1} />
            )}
          </li>
        );
      })}
    </Tag>
  );
}
