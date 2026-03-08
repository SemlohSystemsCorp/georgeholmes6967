-- Migration 002: Enable Supabase Realtime on key tables
-- Run this in your Supabase SQL editor

-- Enable realtime for organizations (dashboard updates when plan changes)
alter publication supabase_realtime add table public.organizations;

-- Enable realtime for organization_members (dashboard updates when user joins a workspace)
alter publication supabase_realtime add table public.organization_members;

-- Enable realtime for messages (for future chat functionality)
alter publication supabase_realtime add table public.messages;

-- Enable realtime for channels
alter publication supabase_realtime add table public.channels;
