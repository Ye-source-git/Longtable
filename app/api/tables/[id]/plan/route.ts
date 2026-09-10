import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ALL_BOOKS } from "@/lib/constants";

// Lifecycle for a table's *own* reading plan. Everything here is owner-only and
// runs through the service role after an explicit ownership check, so no
// authenticated write policy on plans/plan_days is needed.
//
//   POST   { book, startChapter?, endChapter? }  → build & start a custom plan
//   POST   { restartPlanId }                     → un-archive & restart one
//   DELETE                                        → stop the active plan
//                                                  (archives it if custom)

async function requireOwner(id: string) {
  const tableId = Number(id);
  if (!Number.isInteger(tableId)) return { error: NextResponse.json({ error: "Bad table id." }, { status: 400 }) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.is_anonymous) {
    return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  }

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("table_members")
    .select("role")
    .eq("table_id", tableId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (membership?.role !== "owner") {
    return { error: NextResponse.json({ error: "Only the table owner can change the plan." }, { status: 403 }) };
  }

  return { tableId, userId: user.id, admin };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireOwner(id);
  if (gate.error) return gate.error;
  const { tableId, userId, admin } = gate;

  const body = await req.json().catch(() => null);

  // --- restart an archived custom plan ---------------------------------------
  if (typeof body?.restartPlanId === "string") {
    const { data: plan } = await admin
      .from("plans")
      .select("id, owner_table_id")
      .eq("id", body.restartPlanId)
      .maybeSingle();
    if (!plan || plan.owner_table_id !== tableId) {
      return NextResponse.json({ error: "That plan doesn’t belong to this table." }, { status: 404 });
    }
    await admin.from("plans").update({ archived_at: null }).eq("id", plan.id);
    await admin.from("table_plans").delete().eq("table_id", tableId);
    await admin.from("table_plans").insert({ table_id: tableId, plan_id: plan.id, started_by: userId });
    return NextResponse.json({ planId: plan.id });
  }

  // --- build a new custom plan from a book (+ optional chapter range) --------
  const book = typeof body?.book === "string" ? body.book.trim() : "";
  const match = ALL_BOOKS.find(([b]) => b.toLowerCase() === book.toLowerCase());
  if (!match) return NextResponse.json({ error: "Pick a book of the Bible." }, { status: 400 });
  const [canonicalBook, chapterCount] = match;

  const start = Number.isInteger(body?.startChapter) ? Number(body.startChapter) : 1;
  const end = Number.isInteger(body?.endChapter) ? Number(body.endChapter) : chapterCount;
  if (start < 1 || end > chapterCount || start > end) {
    return NextResponse.json({ error: `Chapters must be between 1 and ${chapterCount}.` }, { status: 400 });
  }

  const isFullBook = start === 1 && end === chapterCount;
  const title = isFullBook ? canonicalBook : `${canonicalBook} ${start}–${end}`;
  const totalDays = end - start + 1;
  const planId = `table-${tableId}-${crypto.randomUUID().slice(0, 8)}`;

  const { error: planErr } = await admin.from("plans").insert({
    id: planId,
    title,
    blurb: `Your table is reading ${isFullBook ? "through " : ""}${title}, one chapter a day.`,
    category: "table-custom",
    tags: ["table plan", canonicalBook],
    total_days: totalDays,
    sort_order: 0,
    owner_table_id: tableId,
  });
  if (planErr) {
    console.error("custom plan insert error", planErr);
    return NextResponse.json({ error: "Couldn’t create the plan just now." }, { status: 500 });
  }

  const dayRows = Array.from({ length: totalDays }, (_, i) => ({
    plan_id: planId,
    day_index: i,
    label: `Chapter ${start + i}`,
    book: canonicalBook,
    chapter: start + i,
    reflection_prompt: "What stood out to you in this chapter?",
  }));
  const { error: daysErr } = await admin.from("plan_days").insert(dayRows);
  if (daysErr) {
    console.error("custom plan_days insert error", daysErr);
    await admin.from("plans").delete().eq("id", planId);
    return NextResponse.json({ error: "Couldn’t create the plan just now." }, { status: 500 });
  }

  await admin.from("table_plans").delete().eq("table_id", tableId);
  await admin.from("table_plans").insert({ table_id: tableId, plan_id: planId, started_by: userId });

  return NextResponse.json({ planId });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireOwner(id);
  if (gate.error) return gate.error;
  const { tableId, admin } = gate;

  // Whatever's currently active for this table…
  const { data: active } = await admin
    .from("table_plans")
    .select("plan_id")
    .eq("table_id", tableId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  await admin.from("table_plans").delete().eq("table_id", tableId);

  // A table's own plan is archived, not destroyed — its days and everyone's
  // progress stay intact so the owner can restart it later.
  if (active) {
    const { data: plan } = await admin
      .from("plans")
      .select("owner_table_id")
      .eq("id", active.plan_id)
      .maybeSingle();
    if (plan?.owner_table_id === tableId) {
      await admin.from("plans").update({ archived_at: new Date().toISOString() }).eq("id", active.plan_id);
    }
  }

  return NextResponse.json({ ok: true });
}
