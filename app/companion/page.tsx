import { Suspense } from "react";
import type { Metadata } from "next";
import { CompanionClient } from "@/components/companion/CompanionClient";

export const metadata: Metadata = {
  title: "Study Companion — Longtable",
  description: "Ask questions about any passage and get grounded, source-cited answers that describe how different traditions read it — without declaring a winner.",
};

export default function CompanionPage() {
  return (
    <Suspense fallback={null}>
      <CompanionClient />
    </Suspense>
  );
}
