-- Schema-tolerant seed script for environments with slightly different table shapes.

do $$
declare
  has_external_id boolean;
  has_first_name boolean;
  has_last_name boolean;
  has_diagnosis boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='patients' and column_name='external_id'
  ) into has_external_id;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='patients' and column_name='first_name'
  ) into has_first_name;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='patients' and column_name='last_name'
  ) into has_last_name;

  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='patients' and column_name='diagnosis'
  ) into has_diagnosis;

  if has_external_id then
    execute $q$
      insert into public.patients (id, external_id, display_name, dob)
      values ('00000000-0000-0000-0000-000000000001', 'PAT-001', 'Pediatric Patient', '2020-05-14')
      on conflict (id) do update
      set display_name = excluded.display_name,
          dob = excluded.dob
    $q$;
  elsif has_first_name and has_last_name and has_diagnosis then
    execute $q$
      insert into public.patients (id, first_name, last_name, diagnosis, display_name, dob)
      values ('00000000-0000-0000-0000-000000000001', 'Pediatric', 'Patient', 'Tetralogy of Fallot', 'Pediatric Patient', '2020-05-14')
      on conflict (id) do update
      set first_name = excluded.first_name,
          last_name = excluded.last_name,
          diagnosis = excluded.diagnosis,
          display_name = coalesce(public.patients.display_name, excluded.display_name),
          dob = coalesce(public.patients.dob, excluded.dob)
    $q$;
  else
    execute $q$
      insert into public.patients (id, display_name, dob)
      values ('00000000-0000-0000-0000-000000000001', 'Pediatric Patient', '2020-05-14')
      on conflict (id) do update
      set display_name = excluded.display_name,
          dob = excluded.dob
    $q$;
  end if;
end $$;

do $$
declare
  device_has_patient_id boolean;
  device_has_device_name boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='devices' and column_name='patient_id'
  ) into device_has_patient_id;
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='devices' and column_name='device_name'
  ) into device_has_device_name;

  if device_has_patient_id and device_has_device_name then
    execute $q$
      insert into public.devices (id, patient_id, device_name, serial_number, model)
      values ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Home Pulse Oximeter', 'OX-DEV-001', 'Pediatric Pulse Oximeter')
      on conflict (id) do update
      set patient_id = excluded.patient_id,
          device_name = excluded.device_name,
          serial_number = excluded.serial_number,
          model = excluded.model
    $q$;
  elsif device_has_patient_id then
    execute $q$
      insert into public.devices (id, patient_id, serial_number, model)
      values ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'OX-DEV-001', 'Pediatric Pulse Oximeter')
      on conflict (id) do update
      set patient_id = excluded.patient_id,
          serial_number = excluded.serial_number,
          model = excluded.model
    $q$;
  elsif device_has_device_name then
    execute $q$
      insert into public.devices (id, device_name, serial_number, model)
      values ('00000000-0000-0000-0000-000000000010', 'Home Pulse Oximeter', 'OX-DEV-001', 'Pediatric Pulse Oximeter')
      on conflict (id) do update
      set device_name = excluded.device_name,
          serial_number = excluded.serial_number,
          model = excluded.model
    $q$;
  else
    execute $q$
      insert into public.devices (id, serial_number, model)
      values ('00000000-0000-0000-0000-000000000010', 'OX-DEV-001', 'Pediatric Pulse Oximeter')
      on conflict (id) do update
      set serial_number = excluded.serial_number,
          model = excluded.model
    $q$;
  end if;
end $$;

do $$
declare
  has_min_spo2 boolean;
  has_max_bpm boolean;
  has_min_bpm boolean;
  has_spo2_low boolean;
  has_bpm_high boolean;
  has_bpm_low boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='thresholds' and column_name='min_spo2'
  ) into has_min_spo2;
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='thresholds' and column_name='max_bpm'
  ) into has_max_bpm;
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='thresholds' and column_name='min_bpm'
  ) into has_min_bpm;
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='thresholds' and column_name='spo2_low'
  ) into has_spo2_low;
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='thresholds' and column_name='bpm_high'
  ) into has_bpm_high;
  select exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='thresholds' and column_name='bpm_low'
  ) into has_bpm_low;

  if has_min_spo2 and has_max_bpm and has_min_bpm then
    execute $q$
      insert into public.thresholds (patient_id, min_spo2, max_bpm, min_bpm)
      values ('00000000-0000-0000-0000-000000000001', 85, 180, 60)
      on conflict do nothing
    $q$;
  elsif has_spo2_low and has_bpm_high and has_bpm_low then
    execute $q$
      insert into public.thresholds (patient_id, spo2_low, bpm_high, bpm_low)
      values ('00000000-0000-0000-0000-000000000001', 85, 180, 60)
      on conflict do nothing
    $q$;
  else
    -- Last-resort minimal insert if only patient_id exists.
    execute $q$
      insert into public.thresholds (patient_id)
      values ('00000000-0000-0000-0000-000000000001')
      on conflict do nothing
    $q$;
  end if;
end $$;

insert into public.readings (
  patient_id, device_id,
  spo2, spo2_min, spo2_max, spo2_avg,
  is_spo2_range, reading_type,
  measured_start, measured_end, measured_at,
  bpm, pi, notes, recorded_at
)
values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 91, 91, 91, 91, false, 'Spot check', now() - interval '6 days', now() - interval '6 days', now() - interval '6 days', 124, 4.1, 'Spot check', now() - interval '6 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, 89, 94, 91.5, true, 'Range reading', now() - interval '5 days', now() - interval '5 days' + interval '45 minutes', now() - interval '5 days', 130, 3.8, 'Evening range sample', now() - interval '5 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 87, 87, 87, 87, false, 'Spot check', now() - interval '4 days', now() - interval '4 days', now() - interval '4 days', 136, 3.4, null, now() - interval '4 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 92, 92, 92, 92, false, 'Spot check', now() - interval '3 days', now() - interval '3 days', now() - interval '3 days', 121, 4.5, null, now() - interval '3 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, 90, 93, 91.5, true, 'Range reading', now() - interval '2 days', now() - interval '2 days' + interval '30 minutes', now() - interval '2 days', 127, 4.0, 'Range reading', now() - interval '2 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 88, 88, 88, 88, false, 'Spot check', now() - interval '1 day', now() - interval '1 day', now() - interval '1 day', 134, 3.6, null, now() - interval '1 day');
