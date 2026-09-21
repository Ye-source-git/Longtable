import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginClient } from "@/components/auth/LoginClient";
import { C } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign in — Longtable",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm italic" style={{ color: C.inkSoft, fontFamily: "'Lora', serif" }}>
          Loading…
        </p>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
