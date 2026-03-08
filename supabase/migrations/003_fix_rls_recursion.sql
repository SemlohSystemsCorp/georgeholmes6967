-- Migration 003: Fix infinite recursion in RLS policies (42P17)
-- The organization_members select policy had a self-referential subquery
-- Run this in your Supabase SQL editor

-- 1. Drop the recursive organization_members select policy
drop policy if exists "Org members can view members" on public.organization_members;

-- 2. Replace with a simple non-recursive policy
--    Users can see all memberships in orgs where they are a member
--    We use security definer function to bypass RLS on the inner check
create or replace function public.user_org_ids(uid uuid)
returns setof uuid
language sql
security definer
set search_path = ''
stable
as $$
  select organization_id from public.organization_members where user_id = uid;
$$;

create policy "Users can view org memberships"
  on public.organization_members for select
  using (
    organization_id in (select public.user_org_ids(auth.uid()))
  );

-- 3. Drop the recursive profiles select policy from migration 001
drop policy if exists "Users can view profiles of org members" on public.profiles;

-- 4. Add a non-recursive profiles policy using the same helper function
create policy "Users can view org member profiles"
  on public.profiles for select
  using (
    auth.uid() = id
    or id in (
      select user_id from public.organization_members
      where organization_id in (select public.user_org_ids(auth.uid()))
    )
  );
