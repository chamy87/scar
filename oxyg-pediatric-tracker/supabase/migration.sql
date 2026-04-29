create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'clinician',
  created_at timestamptz default now()
);

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  display_name text not null,
  dob date,
  created_at timestamptz default now()
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  serial_number text unique not null,
  model text,
  created_at timestamptz default now()
);

create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  device_id uuid references devices(id) on delete set null,
  spo2 numeric(5,2) not null check (spo2 >= 0 and spo2 <= 100),
  bpm integer not null check (bpm >= 0 and bpm <= 300),
  pi numeric(5,2),
  recorded_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists continuous_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  device_id uuid references devices(id),
  started_at timestamptz not null,
  ended_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists waveform_samples (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references continuous_sessions(id) on delete cascade,
  sample_ts timestamptz not null,
  sample_value numeric(8,3) not null
);

create table if not exists thresholds (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  min_spo2 numeric(5,2) default 85,
  max_bpm integer default 180,
  min_bpm integer default 60,
  created_at timestamptz default now()
);

create table if not exists clinical_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  reading_id uuid references readings(id) on delete set null,
  note text not null,
  authored_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table patients enable row level security;
alter table devices enable row level security;
alter table readings enable row level security;
alter table continuous_sessions enable row level security;
alter table waveform_samples enable row level security;
alter table thresholds enable row level security;
alter table clinical_notes enable row level security;

drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Public can read patients" on public.patients;
drop policy if exists "Public can read devices" on public.devices;
drop policy if exists "Public can read readings" on public.readings;
drop policy if exists "Public can read continuous_sessions" on public.continuous_sessions;
drop policy if exists "Public can read waveform_samples" on public.waveform_samples;
drop policy if exists "Public can read thresholds" on public.thresholds;
drop policy if exists "Public can read clinical_notes" on public.clinical_notes;
drop policy if exists "Authenticated can insert readings" on public.readings;
drop policy if exists "Authenticated can update readings" on public.readings;
drop policy if exists "Authenticated can delete readings" on public.readings;

create policy "Public can read profiles" on public.profiles for select to anon, authenticated using (true);
create policy "Public can read patients" on public.patients for select to anon, authenticated using (true);
create policy "Public can read devices" on public.devices for select to anon, authenticated using (true);
create policy "Public can read readings" on public.readings for select to anon, authenticated using (true);
create policy "Public can read continuous_sessions" on public.continuous_sessions for select to anon, authenticated using (true);
create policy "Public can read waveform_samples" on public.waveform_samples for select to anon, authenticated using (true);
create policy "Public can read thresholds" on public.thresholds for select to anon, authenticated using (true);
create policy "Public can read clinical_notes" on public.clinical_notes for select to anon, authenticated using (true);

create policy "Authenticated can insert readings" on public.readings
for insert to authenticated
with check (auth.uid() = created_by);

create policy "Authenticated can update readings" on public.readings
for update to authenticated
using (true)
with check (true);

create policy "Authenticated can delete readings" on public.readings
for delete to authenticated
using (true);

drop policy if exists "Authenticated can write continuous_sessions" on public.continuous_sessions;
drop policy if exists "Authenticated can write waveform_samples" on public.waveform_samples;
drop policy if exists "Authenticated can write thresholds" on public.thresholds;
drop policy if exists "Authenticated can write clinical_notes" on public.clinical_notes;

create policy "Authenticated can write continuous_sessions" on public.continuous_sessions
for all to authenticated
using (true)
with check (true);

create policy "Authenticated can write waveform_samples" on public.waveform_samples
for all to authenticated
using (true)
with check (true);

create policy "Authenticated can write thresholds" on public.thresholds
for all to authenticated
using (true)
with check (true);

create policy "Authenticated can write clinical_notes" on public.clinical_notes
for all to authenticated
using (true)
with check (true);
