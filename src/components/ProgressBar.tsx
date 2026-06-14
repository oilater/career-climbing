interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`${current} / ${total}`}
    >
      <div className="progress__bar" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  );
}
