import { useEffect, useState } from "react";
import { slides } from "../slides";

function readInitialSlideIndex(): number {
  if (typeof window === "undefined") return 0;
  const parsed = parseInt(window.location.hash.replace("#", ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.min(parsed - 1, slides.length - 1);
}

export function useHashIndex() {
  const [slideIndex, setSlideIndex] = useState(readInitialSlideIndex);

  useEffect(
    function syncHash() {
      window.location.hash = String(slideIndex + 1);
    },
    [slideIndex],
  );

  return [slideIndex, setSlideIndex] as const;
}
