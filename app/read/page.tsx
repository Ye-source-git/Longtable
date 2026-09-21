import { Suspense } from "react";
import type { Metadata } from "next";
import { ReadClient } from "@/components/read/ReadClient";
import { C } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Read the Bible — Longtable",
  description: "Read all 66 books in three public-domain translations (WEB, KJV, ASV), with cross-references, commentary, and audio narration alongside the text.",
};

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm italic" style={{ color: C.inkSoft, fontFamily: "'Lora', serif" }}>
          Turning the pages…
        </p>
      }
    >
      <ReadClient />
    </Suspense>
  );
}
