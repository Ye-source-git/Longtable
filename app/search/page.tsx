import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchClient } from "@/components/search/SearchClient";
import { C } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Search the Bible — Longtable",
  description: "Search Scripture by word, name, or phrase across the World English Bible, King James Version, and American Standard Version.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm italic" style={{ color: C.inkSoft, fontFamily: "'Lora', serif" }}>
          Loading…
        </p>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
