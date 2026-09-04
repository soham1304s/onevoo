-- Onevoo verified-account access model
-- Run in the Supabase SQL editor or through the Supabase CLI before enabling the UI.

create type public.verification_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Users may read their own record but cannot create one or set themselves as approved.
create policy "Users read only their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Users update their own non-verification details"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.prevent_user_verification_override()
returns trigger
language plpgsql
as $$
begin
  if new.verification_status is distinct from old.verification_status
     or new.verified_at is distinct from old.verified_at then
    if auth.role() <> 'service_role' then
      raise exception 'Verification status can only be changed by an authorized reviewer';
    end if;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_protect_verification
before update on public.profiles
for each row execute procedure public.prevent_user_verification_override();

create index profiles_verification_status_idx on public.profiles (verification_status);

-- Approval must be performed from a trusted server or Supabase dashboard using the service-role key:
-- update public.profiles set verification_status = 'approved', verified_at = now() where id = '<user-id>';