import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlideView } from "./components/SlideView";
import { PresenterView } from "./components/PresenterView";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import { slides } from "./slides";

type DeckMessage =
  | { type: "state"; index: number; step: number }
  | { type: "nav"; action: "next" | "prev" | "first" | "last" }
  | { type: "request" };

const CHANNEL = "career-deck";

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

function stepsFor(i: number): number {
  const s = slides[i];
  if (!s) return 1;
  if (s.imagesMode === "step" && s.images) return s.images.length;
  if (s.layout === "body" && !s.revealAll) {
    let units = 0;
    for (const b of s.bullets ?? []) {
      units += typeof b !== "string" && b.media?.length ? b.media.length : 1;
    }
    return units + 1 + (s.flashback ? 1 : 0);
  }
  return 1;
}

export default function App() {
  const isPresenter = useMemo(
    () => new URLSearchParams(window.location.search).has("presenter"),
    []
  );
  if (isPresenter) return <PresenterView channel={CHANNEL} />;
  return <Viewer />;
}

function Viewer() {
  const [index, setIndex] = useState(() => {
    const hash = parseInt(window.location.hash.replace("#", ""), 10);
    return Number.isFinite(hash) && hash > 0
      ? Math.min(hash - 1, slides.length - 1)
      : 0;
  });
  const [step, setStep] = useState(0);
  const [showHud, setShowHud] = useState(true);
  const partLabels = useMemo(computePartLabels, []);

  const next = useCallback(() => {
    if (step < stepsFor(index) - 1) {
      setStep((s) => s + 1);
    } else if (index < slides.length - 1) {
      setIndex(index + 1);
      setStep(0);
    }
  }, [index, step]);

  const prev = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else if (index > 0) {
      setIndex(index - 1);
      setStep(stepsFor(index - 1) - 1);
    }
  }, [index, step]);

  const first = useCallback(() => {
    setIndex(0);
    setStep(0);
  }, []);

  const last = useCallback(() => {
    setIndex(slides.length - 1);
    setStep(0);
  }, []);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

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

  // Sync with a presenter window over BroadcastChannel.
  const channelRef = useRef<BroadcastChannel | null>(null);
  const navRef = useRef({ next, prev, first, last });
  navRef.current = { next, prev, first, last };
  const stateRef = useRef({ index, step });
  stateRef.current = { index, step };

  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL);
    channelRef.current = ch;
    ch.onmessage = (e: MessageEvent<DeckMessage>) => {
      const m = e.data;
      if (m.type === "nav") navRef.current[m.action]();
      else if (m.type === "request")
        ch.postMessage({ type: "state", ...stateRef.current });
    };
    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    channelRef.current?.postMessage({ type: "state", index, step });
  }, [index, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "p" || e.key === "P") && !e.metaKey && !e.ctrlKey) {
        window.open(
          `${window.location.pathname}?presenter`,
          "presenter",
          "width=900,height=680"
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const urls = new Set<string>();
    for (const s of slides) {
      if (s.image) urls.add(s.image);
      s.images?.forEach((u) => urls.add(u));
      s.bullets?.forEach((b) => {
        if (typeof b !== "string") {
          if (b.image) urls.add(b.image);
          b.media?.forEach((u) => {
            if (!/\.(webm|mp4|mov|m4v)$/i.test(u)) urls.add(u);
          });
        }
      });
    }
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, []);

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
    <div
      className="viewer"
      onMouseMove={() => setShowHud(true)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <SlideView
        key={`${slide.layout}:${slide.title ?? index}`}
        slide={slide}
        part={partLabels[index]}
        step={step}
      />

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
