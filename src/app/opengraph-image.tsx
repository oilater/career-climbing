import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seo } from "../config";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = seo.title;

const pretendard = readFileSync(
  join(process.cwd(), "node_modules/pretendard/dist/public/static/alternative/Pretendard-Bold.ttf"),
);

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px",
        background: "#0f172a",
        color: "#ffffff",
        fontFamily: "Pretendard",
      }}
    >
      <div style={{ fontSize: 30, color: "#94a3b8", marginBottom: 24 }}>{seo.group}</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1.15 }}>
        {seo.ogTitleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
      <div style={{ fontSize: 34, color: "#cbd5e1", marginTop: 44 }}>
        {`${seo.author.name} · ${seo.author.role}`}
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Pretendard", data: pretendard, weight: 700, style: "normal" }],
    },
  );
}
