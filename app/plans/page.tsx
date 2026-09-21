import { Suspense } from "react";
import type { Metadata } from "next";
import { PlansClient } from "@/components/plans/PlansClient";
import { C } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bible Reading Plans — Longtable",
  description: "Free reading plans for every stage — topical plans for where you are, the life of Jesus, the whole Bible in a year, and a chapter-by-chapter path through any book.",
};

export default function PlansPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm italic" style={{ color: C.inkSoft, fontFamily: "'Lora', serif" }}>
          Loading…
        </p>
      }
    >
      <PlansClient />
    </Suspense>
  );
}
