import Link from "next/link";
import { C } from "@/lib/constants";
import { Section } from "@/components/Section";
import { GoldButton } from "@/components/ui";

export const metadata = {
  title: "About Longtable",
  description:
    "Longtable is a free, denomination-neutral Bible study platform — Scripture, search, reading plans, an AI study companion, and small groups called Tables. No ads, no paywall.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink }} className="mb-2">
        A place to study the Bible, whoever you are.
      </h1>
      <p className="text-[15px] leading-relaxed mb-10" style={{ fontFamily: "'Lora', serif", color: C.inkSoft, fontStyle: "italic" }}>
        Longtable is a free Bible study platform for people of any tradition, any background, or
        none at all — Scripture, reading plans, an AI study companion, and small groups to study
        alongside, without ads, without a paywall, and without telling you what to believe.
      </p>

      <Section title="What you can do here">
        <p>
          <strong style={{ color: C.ink }}>Read</strong> all 66 books in three public-domain translations (the
          World English Bible, King James Version, and American Standard Version), with cross-references, classic
          commentary, and audio narration alongside the text. <strong style={{ color: C.ink }}>Search</strong> the
          whole Bible by word, name, or phrase.
        </p>
        <p>
          Follow a <strong style={{ color: C.ink }}>reading plan</strong> — topical plans for wherever you are
          (grief, doubt, anxiety, gratitude), the life of Jesus, the whole Bible in a year, a chapter-by-chapter
          path through any single book, or a plan your own small group builds together.
        </p>
        <p>
          Ask the <strong style={{ color: C.ink }}>Study Companion</strong> a question about any passage and get a
          grounded, source-cited answer — it describes what the text says, its historical and cultural context, and
          how different traditions have read a contested passage, fairly and by name, without declaring a winner.
          Generate a <strong style={{ color: C.ink }}>discussion guide</strong> for a small group in under a
          minute. Keep a personal <strong style={{ color: C.ink }}>journal</strong> of highlights and reflections.
        </p>
        <p>
          And if you want to read with other people, start a <strong style={{ color: C.ink }}>Table</strong> — a
          small, invite-only group for reading a plan together, sharing prayer requests, and discussing a verse,
          without anything you post ever being public beyond the people you invited.
        </p>
      </Section>

      <Section title="Why denomination-neutral">
        <p>
          Most Bible study tools are built from inside one tradition. Longtable tries to do something
          different: describe what a passage says and how Christians across traditions have actually understood
          it, without picking a winner or steering you toward a particular church. Personal and pastoral questions
          get pointed back to your own community, not answered for you by an app.
        </p>
        <p>
          That&rsquo;s for anyone who&rsquo;s newer to faith, switching traditions, without a home congregation right
          now, or just wants a study tool that doesn&rsquo;t assume which pew they sit in.
        </p>
      </Section>

      <Section title="Is it really free?">
        <p>
          Yes. Every feature described above — reading, search, plans, the Study Companion, Tables — is free, with
          no ads and no paywalled tier. Longtable is a non-profit project, currently operated by an individual
          rather than a registered organization; see the{" "}
          <Link href="/privacy" style={{ color: C.gold, fontWeight: 600 }}>
            Privacy Policy
          </Link>{" "}
          for exactly what that means for your data.
        </p>
      </Section>

      <div className="rounded-2xl px-6 py-8 text-center mt-10" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink }} className="mb-4">
          Start reading — no account needed.
        </p>
        <Link href="/read">
          <GoldButton>Open the Bible</GoldButton>
        </Link>
      </div>
    </div>
  );
}
