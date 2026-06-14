import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "../index.css";
import { seo } from "../config";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: seo.url,
    siteName: seo.title,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: seo.author.name,
  jobTitle: seo.author.role,
  url: seo.url,
  sameAs: [seo.author.site, seo.author.linkedin],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  preload("/images/mountain.webp", { as: "image", fetchPriority: "high" });

  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
