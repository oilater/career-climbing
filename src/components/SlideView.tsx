import { useRef } from "react";
import { Slide } from "../types/slide";
import { revealPlan, resolveBulletMedia } from "../reveal";
import { parseBadgeTitle } from "../utils";
import { useSlideAnimations } from "../hooks/useSlideAnimations";
import { MountainBackdrop, MountainLogo } from "./MountainBackdrop";
import { SplitChars } from "./SplitChars";
import { BulletList } from "./BulletList";

interface Props {
  slide: Slide;
  part?: string;
  step?: number;
}

export function SlideView({ slide, part, step = 0 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reveal = !slide.revealAll;

  const plan = revealPlan(slide);
  const revealUnitCount = plan.length;
  const flashed = !!slide.flashback && reveal && step > revealUnitCount;

  const { image: bulletImage, video: bulletVideo } = resolveBulletMedia(slide, step, reveal, plan);

  const { swapped } = useSlideAnimations({
    rootRef,
    slide,
    step,
    plan,
    flashed,
    bulletMediaKey: bulletImage ?? bulletVideo,
  });

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
  const images = slide.images ?? [];
  const hasImages = images.length > 0;
  const isStepMode = hasImages && slide.imagesMode === "step";
  const safeStep = isStepMode ? Math.max(0, Math.min(step, images.length - 1)) : 0;
  const effectiveImages = isStepMode ? [images[safeStep]] : images;
  const imagesRight = hasImages && slide.imagesPosition === "right";

  if (hasImages && !hasText && !imagesRight) {
    return (
      <div
        className={`slide slide--${slide.layout}${slide.imagesLarge ? " slide--media-fill" : ""}`}
        ref={rootRef}
      >
        <MountainBackdrop />
        {part && <div className="slide__part">{part}</div>}
        <div className="slide__images slide__images--fill">
          {effectiveImages.map((src, i) => (
            <img key={i} src={src} alt="" className="slide__images-item slide__images-item--fill" />
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
      i === lastIdx ? slide.flashback!.lastBullet! : b,
    );
  }
  const showEmphasize = !!slide.emphasize && (!reveal || step >= revealUnitCount);
  const slideHasBulletMedia = !!slide.bullets?.some(
    (b) => typeof b !== "string" && (!!b.image || !!b.video || !!b.media?.length),
  );

  const videoRight = !!slide.video && slide.videoPosition === "right";
  const imageRight = !!slide.image && slide.imagePosition === "right";
  const hasRight =
    videoRight || imageRight || imagesRight || slideHasBulletMedia || !!slide.flashback;

  const displayTitle = swapped && slide.flashback ? slide.flashback.title : slide.title;

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

  const badge = displayTitle ? parseBadgeTitle(displayTitle) : null;
  const badgeKind = badge ? badge.badge.split(/\s+/)[0].toLowerCase() : "";
  const splitTitle = slide.layout === "body";

  const text = (
    <>
      {slide.eyebrow && <div className="eyebrow">{slide.eyebrow}</div>}
      {displayTitle &&
        (badge ? (
          <div className="slide__heading">
            <span className={`slide__badge slide__badge--${badgeKind}`}>{badge.badge}</span>
            <h1 className="slide__title" aria-label={badge.rest}>
              {splitTitle ? <SplitChars text={badge.rest} /> : badge.rest}
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
      {visibleBullets && <BulletList items={visibleBullets} style={slide.bulletStyle ?? "dash"} />}
      {showEmphasize && <p className="slide__emphasize">→ {slide.emphasize}</p>}
      {!imageRight && imageEl}
      {hasImages && !imagesRight && (
        <div className={`slide__images ${isStepMode ? "slide__images--step" : ""}`}>
          {effectiveImages.map((src, i) => (
            <img key={src + i} src={src} alt="" className="slide__images-item" />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div
      className={`slide slide--${slide.layout}${slide.imagesLarge ? " slide--media-lg" : ""}`}
      ref={rootRef}
    >
      <MountainBackdrop />
      {slide.flashback && <div className="slide__flashback-veil" aria-hidden="true" />}
      {part && <div className="slide__part">{part}</div>}
      {hasRight ? (
        <div className="slide__content slide__content--row">
          <div className="slide__text">{text}</div>
          <div className={`slide__media-col${slide.imagesLarge ? " slide__media-col--wide" : ""}`}>
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
              effectiveImages.map((src, i) => (
                <img key={src + i} src={src} alt="" className="slide__images-stack" />
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
