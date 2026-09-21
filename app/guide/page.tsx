import { Suspense } from "react";
import type { Metadata } from "next";
import { GuideClient } from "@/components/guide/GuideClient";
import { C } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Study Guide Generator — Longtable",
  description: "Create a small-group discussion guide for any passage or topic in under a minute — grounded in the text, ready to lead.",
};

export default function GuidePage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm italic" style={{ color: C.inkSoft, fontFamily: "'Lora', serif" }}>
          Loading…
        </p>
      }
    >
      <GuideClient />
    </Suspense>
  );
}
