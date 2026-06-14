import { Slide } from "../types/slide";
import { MountainBackdrop, MountainLogo } from "./MountainBackdrop";

interface Props {
  slide: Slide;
}

export function CoverSlide({ slide }: Props) {
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
