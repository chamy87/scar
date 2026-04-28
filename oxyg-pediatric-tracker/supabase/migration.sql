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

create policy "public read profiles" on profiles for select using (true);
create policy "public read patients" on patients for select using (true);
create policy "public read devices" on devices for select using (true);
create policy "public read readings" on readings for select using (true);
create policy "public read sessions" on continuous_sessions for select using (true);
create policy "public read waveforms" on waveform_samples for select using (true);
create policy "public read thresholds" on thresholds for select using (true);
create policy "public read notes" on clinical_notes for select using (true);

create policy "auth write readings" on readings for insert to authenticated with check (auth.uid() is not null);
create policy "auth update readings" on readings for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "auth delete readings" on readings for delete to authenticated using (auth.uid() is not null);

create policy "auth write sessions" on continuous_sessions for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "auth write thresholds" on thresholds for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "auth write notes" on clinical_notes for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
