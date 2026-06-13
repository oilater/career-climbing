import { useEffect, useState } from "react";
import { Bullet, Slide } from "../types/slide";
import { slides } from "../slides";

type DeckMessage =
  | { type: "state"; index: number; step: number }
  | { type: "nav"; action: "next" | "prev" | "first" | "last" }
  | { type: "request" };

const bulletText = (b: Bullet) => (typeof b === "string" ? b : b.text);

const titleText = (s: Slide | undefined) => {
  if (!s?.title) return "";
  const m = s.title.match(/^([A-Za-z]+(?:\s+\d+)?)\.\s+(.+)$/);
  return m ? `${m[1]} · ${m[2]}` : s.title;
};

export function PresenterView({ channel }: { channel: string }) {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ch = new BroadcastChannel(channel);
    ch.onmessage = (e: MessageEvent<DeckMessage>) => {
      const m = e.data;
      if (m.type === "state") {
        setIndex(m.index);
        setStep(m.step);
      }
    };
    ch.postMessage({ type: "request" });

    const nav = (action: "next" | "prev" | "first" | "last") =>
      ch.postMessage({ type: "nav", action });
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          nav("next");
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          nav("prev");
          break;
        case "Home":
          e.preventDefault();
          nav("first");
          break;
        case "End":
          e.preventDefault();
          nav("last");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      ch.close();
    };
  }, [channel]);

  const slide = slides[index];
  const nextSlide = slides[index + 1];
  const bullets = slide?.bullets ?? [];

  return (
    <div className="presenter">
      <header className="presenter__bar">
        <span className="presenter__count">
          {index + 1} <span className="presenter__sep">/</span> {slides.length}
        </span>
        <span className="presenter__step">단계 {step + 1}</span>
      </header>

      <section className="presenter__current">
        <div className="presenter__label">현재 슬라이드</div>
        <h1 className="presenter__title">{titleText(slide)}</h1>
        {bullets.length > 0 && (
          <ul className="presenter__bullets">
            {bullets.map((b, i) => (
              <li key={i}>{bulletText(b)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="presenter__notes">
        <div className="presenter__label">발표자 노트</div>
        {slide?.notes ? (
          <p className="presenter__notes-body">{slide.notes}</p>
        ) : (
          <p className="presenter__notes-empty">노트 없음</p>
        )}
      </section>

      <footer className="presenter__next">
        <span className="presenter__label">다음</span>
        <span className="presenter__next-title">
          {nextSlide ? titleText(nextSlide) || nextSlide.eyebrow || "—" : "끝"}
        </span>
      </footer>
    </div>
  );
}
