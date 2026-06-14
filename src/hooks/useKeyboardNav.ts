import { useEffect } from "react";

interface KeyboardNavOptions {
  onNext: () => void;
  onPrev: () => void;
  onFirst?: () => void;
  onLast?: () => void;
  onTogglePresent?: () => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  onNext,
  onPrev,
  onFirst,
  onLast,
  onTogglePresent,
  enabled = true,
}: KeyboardNavOptions) {
  useEffect(
    function bindKeyboardNav() {
      if (!enabled) return;

      const handleKeydown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        ) {
          return;
        }

        const isMedia = target && (target.tagName === "VIDEO" || target.tagName === "AUDIO");

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
          case "PageDown":
            e.preventDefault();
            onNext();
            break;
          case " ":
            if (isMedia) return;
            e.preventDefault();
            onNext();
            break;
          case "ArrowLeft":
          case "ArrowUp":
          case "PageUp":
            e.preventDefault();
            onPrev();
            break;
          case "Home":
            e.preventDefault();
            onFirst?.();
            break;
          case "End":
            e.preventDefault();
            onLast?.();
            break;
          case "f":
          case "F":
            if (onTogglePresent) {
              e.preventDefault();
              onTogglePresent();
            }
            break;
        }
      };

      window.addEventListener("keydown", handleKeydown);
      return () => window.removeEventListener("keydown", handleKeydown);
    },
    [onNext, onPrev, onFirst, onLast, onTogglePresent, enabled],
  );
}
