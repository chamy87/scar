insert into patients (id, external_id, display_name, dob) values
('00000000-0000-0000-0000-000000000001', 'PAT-001', 'Patient A', '2020-05-14')
on conflict (id) do nothing;

insert into devices (id, serial_number, model) values
('00000000-0000-0000-0000-000000000010', 'OX-DEV-001', 'Pediatric Pulse Oximeter')
on conflict (id) do nothing;

insert into thresholds (patient_id, min_spo2, max_bpm, min_bpm)
values ('00000000-0000-0000-0000-000000000001', 85, 180, 60)
on conflict do nothing;

insert into readings (patient_id, device_id, spo2, spo2_min, spo2_max, spo2_avg, is_spo2_range, measured_start, measured_end, bpm, pi, notes, recorded_at)
values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 91, 91, 91, 91, false, now() - interval '6 days', now() - interval '6 days', 124, 4.1, 'Spot check', now() - interval '6 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, 89, 94, 91.5, true, now() - interval '5 days', now() - interval '5 days' + interval '45 minutes', 130, 3.8, 'Evening range sample', now() - interval '5 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 87, 87, 87, 87, false, now() - interval '4 days', now() - interval '4 days', 136, 3.4, null, now() - interval '4 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 92, 92, 92, 92, false, now() - interval '3 days', now() - interval '3 days', 121, 4.5, null, now() - interval '3 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, 90, 93, 91.5, true, now() - interval '2 days', now() - interval '2 days' + interval '30 minutes', 127, 4.0, 'Range reading', now() - interval '2 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 88, 88, 88, 88, false, now() - interval '1 day', now() - interval '1 day', 134, 3.6, null, now() - interval '1 day');
