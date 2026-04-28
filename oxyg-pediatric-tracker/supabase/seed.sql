insert into patients (id, external_id, display_name, dob) values
('00000000-0000-0000-0000-000000000001', 'PAT-001', 'Patient A', '2020-05-14')
on conflict (id) do nothing;

insert into devices (id, serial_number, model) values
('00000000-0000-0000-0000-000000000010', 'OX-DEV-001', 'Pediatric Pulse Oximeter')
on conflict (id) do nothing;

insert into thresholds (patient_id, min_spo2, max_bpm, min_bpm)
values ('00000000-0000-0000-0000-000000000001', 85, 180, 60)
on conflict do nothing;

insert into readings (patient_id, device_id, spo2, bpm, pi, recorded_at)
values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 91, 124, 4.1, now() - interval '6 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 89, 130, 3.8, now() - interval '5 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 87, 136, 3.4, now() - interval '4 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 92, 121, 4.5, now() - interval '3 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 90, 127, 4.0, now() - interval '2 days'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 88, 134, 3.6, now() - interval '1 day');
