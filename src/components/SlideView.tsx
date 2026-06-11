import { Bullet, Slide } from "../types/slide";
import { MountainBackdrop, MountainLogo } from "./MountainBackdrop";

interface Props {
  slide: Slide;
  part?: string;
  step?: number;
}

export function SlideView({ slide, part, step = 0 }: Props) {
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
      <div className={`slide slide--${slide.layout}`}>
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

  const videoRight = !!slide.video && slide.videoPosition === "right";
  const imageRight = !!slide.image && slide.imagePosition === "right";
  const hasRight = videoRight || imageRight || imagesRight;

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

  const text = (
    <>
      {slide.eyebrow && <div className="eyebrow">{slide.eyebrow}</div>}
      {slide.title && <h1 className="slide__title">{slide.title}</h1>}
      {slide.subtitle && <p className="slide__sub">{slide.subtitle}</p>}
      {slide.body && <p className="slide__body">{slide.body}</p>}
      {!videoRight && videoEl}
      {slide.bullets && (
        <BulletList items={slide.bullets} style={slide.bulletStyle ?? "dash"} />
      )}
      {slide.emphasize && (
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
    <div className={`slide slide--${slide.layout}`}>
      <MountainBackdrop />
      {part && <div className="slide__part">{part}</div>}
      {hasRight ? (
        <div className="slide__content slide__content--row">
          <div className="slide__text">{text}</div>
          <div className="slide__media-col">
            {videoRight && videoEl}
            {imageRight && imageEl}
            {imagesRight &&
              effectiveImages!.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt=""
                  className="slide__images-stack"
                />
              ))}
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
