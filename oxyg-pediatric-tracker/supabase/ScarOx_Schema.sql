-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.clinical_notes (
                                       id uuid NOT NULL DEFAULT gen_random_uuid(),
                                       patient_id uuid NOT NULL,
                                       note_type text DEFAULT 'general'::text CHECK (note_type = ANY (ARRAY['general'::text, 'cardiology'::text, 'event'::text, 'caregiver'::text])),
                                       note text NOT NULL,
                                       created_by uuid,
                                       created_at timestamp with time zone NOT NULL DEFAULT now(),
                                       CONSTRAINT clinical_notes_pkey PRIMARY KEY (id),
                                       CONSTRAINT clinical_notes_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
                                       CONSTRAINT clinical_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.continuous_sessions (
                                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                                            patient_id uuid NOT NULL,
                                            device_id uuid,
                                            session_start timestamp with time zone NOT NULL,
                                            session_end timestamp with time zone,
                                            avg_spo2 numeric,
                                            min_spo2 numeric,
                                            max_spo2 numeric,
                                            avg_bpm numeric,
                                            min_bpm integer,
                                            max_bpm integer,
                                            desaturation_event_count integer DEFAULT 0,
                                            notes text,
                                            created_by uuid,
                                            created_at timestamp with time zone NOT NULL DEFAULT now(),
                                            CONSTRAINT continuous_sessions_pkey PRIMARY KEY (id),
                                            CONSTRAINT continuous_sessions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
                                            CONSTRAINT continuous_sessions_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id),
                                            CONSTRAINT continuous_sessions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.devices (
                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                patient_id uuid NOT NULL,
                                device_name text NOT NULL,
                                manufacturer text,
                                model text,
                                serial_number text,
                                notes text,
                                created_at timestamp with time zone NOT NULL DEFAULT now(),
                                CONSTRAINT devices_pkey PRIMARY KEY (id),
                                CONSTRAINT devices_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.patients (
                                 id uuid NOT NULL DEFAULT gen_random_uuid(),
                                 first_name text NOT NULL,
                                 last_name text NOT NULL,
                                 date_of_birth date,
                                 diagnosis text DEFAULT 'Tetralogy of Fallot'::text,
                                 notes text,
                                 created_at timestamp with time zone NOT NULL DEFAULT now(),
                                 updated_at timestamp with time zone NOT NULL DEFAULT now(),
                                 CONSTRAINT patients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
                                 id uuid NOT NULL,
                                 email text UNIQUE,
                                 full_name text,
                                 role text NOT NULL DEFAULT 'caregiver'::text CHECK (role = ANY (ARRAY['admin'::text, 'clinician'::text, 'caregiver'::text])),
                                 created_at timestamp with time zone NOT NULL DEFAULT now(),
                                 CONSTRAINT profiles_pkey PRIMARY KEY (id),
                                 CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.readings (
                                 id uuid NOT NULL DEFAULT gen_random_uuid(),
                                 patient_id uuid NOT NULL,
                                 device_id uuid,
                                 reading_type text NOT NULL CHECK (reading_type = ANY (ARRAY['spot_check'::text, 'continuous_sample'::text])),
                                 measured_at timestamp with time zone NOT NULL,
                                 spo2 numeric CHECK (spo2 >= 0::numeric AND spo2 <= 100::numeric),
  bpm integer CHECK (bpm > 0 AND bpm < 300),
  perfusion_index numeric CHECK (perfusion_index >= 0::numeric),
  signal_quality numeric CHECK (signal_quality >= 0::numeric AND signal_quality <= 100::numeric),
  notes text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT readings_pkey PRIMARY KEY (id),
  CONSTRAINT readings_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
  CONSTRAINT readings_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id),
  CONSTRAINT readings_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.thresholds (
                                   id uuid NOT NULL DEFAULT gen_random_uuid(),
                                   patient_id uuid NOT NULL,
                                   low_spo2_threshold numeric,
                                   high_bpm_threshold integer,
                                   low_bpm_threshold integer,
                                   notes text,
                                   created_by uuid,
                                   created_at timestamp with time zone NOT NULL DEFAULT now(),
                                   CONSTRAINT thresholds_pkey PRIMARY KEY (id),
                                   CONSTRAINT thresholds_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
                                   CONSTRAINT thresholds_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.waveform_samples (
                                         id uuid NOT NULL DEFAULT gen_random_uuid(),
                                         patient_id uuid NOT NULL,
                                         reading_id uuid,
                                         session_id uuid,
                                         measured_at timestamp with time zone NOT NULL,
                                         sample_rate_hz integer,
                                         waveform jsonb NOT NULL,
                                         created_by uuid,
                                         created_at timestamp with time zone NOT NULL DEFAULT now(),
                                         CONSTRAINT waveform_samples_pkey PRIMARY KEY (id),
                                         CONSTRAINT waveform_samples_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
                                         CONSTRAINT waveform_samples_reading_id_fkey FOREIGN KEY (reading_id) REFERENCES public.readings(id),
                                         CONSTRAINT waveform_samples_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.continuous_sessions(id),
                                         CONSTRAINT waveform_samples_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);