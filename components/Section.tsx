import { C } from "@/lib/constants";

// Shared long-form-page section heading, used by Privacy, Terms, and About.
// Deliberately not a client component — these are static prose pages, and
// staying server-only keeps them out of the client JS bundle entirely.
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink }} className="mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed" style={{ fontFamily: "'Lora', serif", color: C.ink }}>
        {children}
      </div>
    </div>
  );
}
