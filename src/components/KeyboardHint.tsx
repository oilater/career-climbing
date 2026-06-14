import { useEffect, useState } from "react";

export function KeyboardHint() {
  const [visible, setVisible] = useState(true);

  useEffect(function hideAfterDelay() {
    const timer = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`keyboard-hint ${visible ? "keyboard-hint--visible" : ""}`} aria-hidden="true">
      ← → 방향키로 이동하세요
    </div>
  );
}
