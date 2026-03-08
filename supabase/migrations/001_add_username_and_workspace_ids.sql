-- Migration 001: Add username to profiles, switch to numeric IDs for workspaces
-- Run this in your Supabase SQL editor

-- Add username column to profiles
alter table public.profiles add column if not exists username text unique;

-- Add invite_code column to organizations for /join links
alter table public.organizations add column if not exists invite_code text unique;

-- Add storage_used_bytes to organizations for tracking storage
alter table public.organizations add column if not exists storage_used_bytes bigint default 0;

-- Add plan column to organizations
alter table public.organizations add column if not exists plan text default 'free' check (plan in ('free', 'pro', 'enterprise'));

-- Create index for username lookups
create index if not exists idx_profiles_username on public.profiles(username);

-- Create index for invite code lookups
create index if not exists idx_organizations_invite_code on public.organizations(invite_code);

-- Allow users to view profiles of members in their organizations
create policy "Users can view profiles of org members"
  on public.profiles for select
  using (
    id in (
      select om.user_id from public.organization_members om
      where om.organization_id in (
        select om2.organization_id from public.organization_members om2
        where om2.user_id = auth.uid()
      )
    )
    or auth.uid() = id
  );

-- Organization policies
create policy "Org members can view their organizations"
  on public.organizations for select
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- Organization members policies
create policy "Org members can view members"
  on public.organization_members for select
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

create policy "Org owners can insert members"
  on public.organization_members for insert
  with check (auth.uid() is not null);

-- Anyone can view orgs by invite code (for join page)
create policy "Anyone can view org by invite code"
  on public.organizations for select
  using (invite_code is not null);
