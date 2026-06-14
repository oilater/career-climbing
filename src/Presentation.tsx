import { useState } from "react";
import { SlideView } from "./components/SlideView";
import { ProgressBar } from "./components/ProgressBar";
import { KeyboardHint } from "./components/KeyboardHint";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import { useSwipeNav } from "./hooks/useSwipeNav";
import { useImagePreload } from "./hooks/useImagePreload";
import { useHashIndex } from "./hooks/useHashIndex";
import { slides, partLabels } from "./slides";
import { stepCount } from "./reveal";

const revealStepsForSlide = (slideIndex: number) => stepCount(slides[slideIndex]);

export default function Presentation() {
  const [slideIndex, setSlideIndex] = useHashIndex();
  const [stepInSlide, setStepInSlide] = useState(0);

  const next = () => {
    if (stepInSlide < revealStepsForSlide(slideIndex) - 1) {
      setStepInSlide((current) => current + 1);
    } else if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
      setStepInSlide(0);
    }
  };

  const prev = () => {
    if (stepInSlide > 0) {
      setStepInSlide((current) => current - 1);
    } else if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
      setStepInSlide(revealStepsForSlide(slideIndex - 1) - 1);
    }
  };

  const first = () => {
    setSlideIndex(0);
    setStepInSlide(0);
  };

  const last = () => {
    setSlideIndex(slides.length - 1);
    setStepInSlide(0);
  };

  const { onTouchStart, onTouchEnd } = useSwipeNav({ onNext: next, onPrev: prev });

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  useKeyboardNav({
    onNext: next,
    onPrev: prev,
    onFirst: first,
    onLast: last,
    onTogglePresent: toggleFullscreen,
  });

  useImagePreload(slideIndex);

  const slide = slides[slideIndex];
  if (!slide) return null;

  return (
    <div className="viewer" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <SlideView
        key={`${slide.layout}:${slide.title ?? slideIndex}`}
        slide={slide}
        part={partLabels[slideIndex]}
        step={stepInSlide}
      />

      <ProgressBar current={slideIndex + 1} total={slides.length} />
      <KeyboardHint />
    </div>
  );
}
