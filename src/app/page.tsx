"use client";

import dynamic from "next/dynamic";

const Presentation = dynamic(() => import("../Presentation"), { ssr: false });

export default function Page() {
  return (
    <main>
      <Presentation />
    </main>
  );
}
