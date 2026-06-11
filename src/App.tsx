import { useCallback, useEffect, useMemo, useState } from "react";
import { SlideView } from "./components/SlideView";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import { slides } from "./slides";

function computePartLabels(): (string | undefined)[] {
  let current: string | undefined;
  return slides.map((s) => {
    if (s.layout === "section") {
      current = s.title || s.eyebrow;
      return undefined;
    }
    return s.layout === "body" ? current : undefined;
  });
}

export default function App() {
  const [index, setIndex] = useState(() => {
    const hash = parseInt(window.location.hash.replace("#", ""), 10);
    return Number.isFinite(hash) && hash > 0
      ? Math.min(hash - 1, slides.length - 1)
      : 0;
  });
  const [step, setStep] = useState(0);
  const [showHud, setShowHud] = useState(true);
  const partLabels = useMemo(computePartLabels, []);

  const stepsFor = useCallback((i: number): number => {
    const s = slides[i];
    return s?.imagesMode === "step" && s.images ? s.images.length : 1;
  }, []);

  const goTo = useCallback((target: number) => {
    setIndex(Math.max(0, Math.min(target, slides.length - 1)));
    setStep(0);
  }, []);

  const next = useCallback(() => {
    const steps = stepsFor(index);
    if (step < steps - 1) {
      setStep((s) => s + 1);
    } else if (index < slides.length - 1) {
      setIndex(index + 1);
      setStep(0);
    }
  }, [index, step, stepsFor]);

  const prev = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else if (index > 0) {
      const target = index - 1;
      setIndex(target);
      setStep(stepsFor(target) - 1);
    }
  }, [index, step, stepsFor]);

  const first = useCallback(() => goTo(0), [goTo]);
  const last = useCallback(() => goTo(slides.length - 1), [goTo]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      document.documentElement.requestFullscreen().catch(() => undefined);
    }
  }, []);

  useKeyboardNav({
    onNext: next,
    onPrev: prev,
    onFirst: first,
    onLast: last,
    onTogglePresent: toggleFullscreen,
  });

  useEffect(() => {
    window.location.hash = String(index + 1);
  }, [index]);

  useEffect(() => {
    setShowHud(true);
    const t = window.setTimeout(() => setShowHud(false), 2200);
    return () => window.clearTimeout(t);
  }, [index]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <div className="viewer" onMouseMove={() => setShowHud(true)}>
      <SlideView slide={slide} part={partLabels[index]} step={step} />

      <button
        className="edge edge--left"
        onClick={prev}
        disabled={index === 0}
        aria-label="이전 슬라이드"
      />
      <button
        className="edge edge--right"
        onClick={next}
        disabled={index === slides.length - 1}
        aria-label="다음 슬라이드"
      />

      <div className={`progress ${showHud ? "progress--visible" : ""}`}>
        <div
          className="progress__bar"
          style={{ width: `${((index + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
