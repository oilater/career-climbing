import { useRef } from "react";
import type { TouchEvent } from "react";

interface SwipeNavOptions {
  onNext: () => void;
  onPrev: () => void;
}

export function useSwipeNav({ onNext, onPrev }: SwipeNavOptions) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent) => {
    const origin = start.current;
    if (!origin) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - origin.x;
    const deltaY = touch.clientY - origin.y;
    start.current = null;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) onNext();
    else onPrev();
  };

  return { onTouchStart, onTouchEnd };
}
