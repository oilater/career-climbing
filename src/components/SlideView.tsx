import { useRef } from "react";
import { Slide } from "../types/slide";
import { revealPlan, resolveBulletMedia, resolveVisibleContent } from "../reveal";
import { parseBadgeTitle } from "../utils";
import { useSlideAnimations, REVEAL } from "../hooks/useSlideAnimations";
import { MountainBackdrop } from "./MountainBackdrop";
import { CoverSlide } from "./CoverSlide";
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
    return <CoverSlide slide={slide} />;
  }

  const hasText = !!(
    slide.eyebrow ||
    slide.title ||
    slide.subtitle ||
    slide.body ||
    slide.bullets?.length ||
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
        <div className="slide__images slide__images--fill" data-reveal={REVEAL.media}>
          {effectiveImages.map((src, i) => (
            <img key={i} src={src} alt="" className="slide__images-item slide__images-item--fill" />
          ))}
        </div>
      </div>
    );
  }

  const { visibleBullets, showEmphasize, displayTitle } = resolveVisibleContent(
    slide,
    step,
    plan,
    swapped,
  );

  const slideHasBulletMedia = !!slide.bullets?.some(
    (bullet) =>
      typeof bullet !== "string" && (!!bullet.image || !!bullet.video || !!bullet.media?.length),
  );

  const videoRight = !!slide.video && slide.videoPosition === "right";
  const imageRight = !!slide.image && slide.imagePosition === "right";
  const hasRight =
    videoRight || imageRight || imagesRight || slideHasBulletMedia || !!slide.flashback;

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
            <span className={`slide__badge slide__badge--${badgeKind}`} data-reveal={REVEAL.badge}>
              {badge.badge}
            </span>
            <h1 className="slide__title" aria-label={badge.rest}>
              {splitTitle ? <SplitChars text={badge.rest} /> : badge.rest}
            </h1>
          </div>
        ) : (
          <h1 className="slide__title" aria-label={displayTitle}>
            {splitTitle ? <SplitChars text={displayTitle} /> : displayTitle}
          </h1>
        ))}
      {slide.subtitle && (
        <p className="slide__sub" data-reveal={REVEAL.text}>
          {slide.subtitle}
        </p>
      )}
      {slide.body && (
        <p className="slide__body" data-reveal={REVEAL.text}>
          {slide.body}
        </p>
      )}
      {!videoRight && videoEl}
      {visibleBullets && <BulletList items={visibleBullets} style={slide.bulletStyle ?? "dash"} />}
      {showEmphasize && (
        <p className="slide__emphasize" data-reveal={REVEAL.text}>
          → {slide.emphasize}
        </p>
      )}
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
          <div
            className={`slide__media-col${slide.imagesLarge ? " slide__media-col--wide" : ""}`}
            data-reveal={REVEAL.media}
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
