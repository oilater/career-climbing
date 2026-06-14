export function SplitChars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) =>
        ch === "\n" ? (
          <br key={i} />
        ) : (
          <span key={i} className="ce-char" aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </>
  );
}
