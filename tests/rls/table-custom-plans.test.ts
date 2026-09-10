import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { adminClient, anonClient, cleanupUser, createTestUser, type TestUser } from "../helpers";

describe("table-authored custom plans RLS", () => {
  let owner: TestUser, member: TestUser, outsider: TestUser;
  let tableId: number;
  let customPlanId: string;

  beforeAll(async () => {
    owner = await createTestUser("cp-owner");
    member = await createTestUser("cp-member");
    outsider = await createTestUser("cp-outsider");

    const admin = adminClient();
    const { data: table } = await admin
      .from("tables")
      .insert({ name: "Custom Plan Table", invite_code: `cp-${Date.now()}`, created_by: owner.id })
      .select()
      .single();
    tableId = table!.id;
    await admin.from("table_members").insert([
      { table_id: tableId, user_id: owner.id, role: "owner" },
      { table_id: tableId, user_id: member.id, role: "member" },
    ]);

    customPlanId = `table-${tableId}-test`;
    await admin.from("plans").insert({
      id: customPlanId,
      title: "Romans (test)",
      blurb: "test",
      category: "table-custom",
      total_days: 2,
      owner_table_id: tableId,
    });
    await admin.from("plan_days").insert([
      { plan_id: customPlanId, day_index: 0, label: "Chapter 1", book: "Romans", chapter: 1 },
      { plan_id: customPlanId, day_index: 1, label: "Chapter 2", book: "Romans", chapter: 2 },
    ]);
    await admin.from("table_plans").insert({ table_id: tableId, plan_id: customPlanId, started_by: owner.id });
  });

  afterAll(async () => {
    for (const u of [owner, member, outsider]) await cleanupUser(u.id);
  });

  it("a table's custom plan is visible to its members, not to outsiders", async () => {
    expect((await owner.client.from("plans").select().eq("id", customPlanId)).data).toHaveLength(1);
    expect((await member.client.from("plans").select().eq("id", customPlanId)).data).toHaveLength(1);
    expect((await outsider.client.from("plans").select().eq("id", customPlanId)).data).toHaveLength(0);
  });

  it("its plan_days follow the same visibility", async () => {
    expect((await member.client.from("plan_days").select().eq("plan_id", customPlanId)).data).toHaveLength(2);
    expect((await outsider.client.from("plan_days").select().eq("plan_id", customPlanId)).data).toHaveLength(0);
  });

  it("the catalog stays world-readable, and excludes custom plans by the owner_table_id filter", async () => {
    const anon = anonClient();
    const catalog = await anon.from("plans").select("id").is("owner_table_id", null).limit(5);
    expect(catalog.error).toBeNull();
    expect((catalog.data ?? []).length).toBeGreaterThan(0);
    // A custom plan is never returned by a catalog-style query.
    expect((await anon.from("plans").select("id").eq("id", customPlanId)).data ?? []).toHaveLength(0);
  });

  it("a member cannot edit or delete the table's custom plan (writes go through the owner-checked API route only)", async () => {
    await member.client.from("plans").update({ title: "hijacked" }).eq("id", customPlanId);
    await member.client.from("plans").delete().eq("id", customPlanId);
    await owner.client.from("plans").update({ title: "also blocked" }).eq("id", customPlanId);
    const { data } = await adminClient().from("plans").select("title").eq("id", customPlanId).single();
    expect(data?.title).toBe("Romans (test)");
  });

  it("progress on the custom plan is shared with the table, like any started plan", async () => {
    await member.client.from("plan_progress").insert({ user_id: member.id, plan_id: customPlanId, day_index: 0 });
    expect(
      (await owner.client.from("plan_progress").select().eq("user_id", member.id).eq("plan_id", customPlanId)).data
    ).toHaveLength(1);
    expect(
      (await outsider.client.from("plan_progress").select().eq("user_id", member.id).eq("plan_id", customPlanId)).data
    ).toHaveLength(0);
  });
});
