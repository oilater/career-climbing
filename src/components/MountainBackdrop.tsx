export function MountainBackdrop() {
  return <img className="mountain-backdrop" src="/images/mountain.png" alt="" aria-hidden />;
}

export function MountainLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill="#0f172a" />
      <path d="M5 23 L12 12 L17 19 L21 14 L27 23 Z" fill="#34d399" />
    </svg>
  );
}
