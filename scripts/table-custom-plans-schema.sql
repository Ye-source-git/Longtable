-- Lets a table owner author a reading plan that belongs to their table,
-- reusing the existing plans / plan_days tables rather than a parallel
-- structure. A custom plan is just a plans row with owner_table_id set, so it
-- inherits the whole reading experience for free: mark-a-day, reflect,
-- share with the table, ask the Companion, and the shared collective streak.
--
-- Visibility:
--   * catalog plans  (owner_table_id is null) stay world-readable, as before
--   * custom plans    (owner_table_id set)     are readable only by that
--                                              table's members, and are kept
--                                              out of the public /plans catalog
--                                              by an explicit filter in the app
--
-- Writes still go exclusively through the ownership-checked API route
-- (app/api/tables/[id]/plan), so no INSERT/UPDATE/DELETE policy is granted to
-- authenticated here — service_role already has full access.
--
-- Run once in the Supabase SQL editor, after table-plans-schema.sql.

alter table public.plans
  add column if not exists owner_table_id bigint references public.tables(id) on delete cascade;

alter table public.plans
  add column if not exists archived_at timestamptz;

create index if not exists plans_by_owner_table
  on public.plans (owner_table_id) where owner_table_id is not null;

-- Replace the blanket "everything is public" SELECT policies with ones that
-- keep the catalog public but scope custom plans to their table.
drop policy if exists "plans are public" on public.plans;
drop policy if exists "plan days are public" on public.plan_days;

create policy "catalog plans are public" on public.plans
  for select using (owner_table_id is null);

create policy "custom plans visible to their table" on public.plans
  for select using (owner_table_id is not null and public.is_table_member(owner_table_id));

-- plan_days has no owner column of its own — it follows its parent plan's
-- visibility. The is_table_member() call is only reached when owner_table_id
-- is not null, thanks to short-circuit evaluation.
create policy "plan days follow their plan's visibility" on public.plan_days
  for select using (
    exists (
      select 1 from public.plans p
      where p.id = plan_days.plan_id
        and (p.owner_table_id is null or public.is_table_member(p.owner_table_id))
    )
  );
