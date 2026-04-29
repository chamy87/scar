# OxyG Pediatric Tracker

React + Vite + TypeScript pediatric Tetralogy of Fallot oxygen/heart-rate reporting tool.

Safety disclaimer shown in app:
`Reporting only. This tool does not diagnose, monitor emergencies, or replace clinical judgment.`

## Stack
- React + Vite + TypeScript
- Supabase Auth + Postgres + RLS
- Tailwind CSS
- shadcn-style UI components + lucide-react icons
- Recharts
- Vercel deployment

## Routes
- `/dashboard`
- `/readings`
- `/sessions`
- `/reports`
- `/login`
- `/settings`

## Local setup
1. Install dependencies:
   `npm install`
2. Add env vars:
   - Copy `.env.example` to `.env.local`
   - Keep only publishable/anon key in frontend. Never use service role key in `VITE_*`.
   - Restart dev server after editing `.env.local`.
3. Start dev server:
   `npm run dev`

## Supabase setup
1. Open SQL editor in your Supabase project.
2. Run [`supabase/migration.sql`](./supabase/migration.sql).
3. Run [`supabase/seed.sql`](./supabase/seed.sql).
4. In Supabase Dashboard -> Authentication -> Providers, enable Email provider (email/password).
5. In Supabase Dashboard -> Authentication -> Users, create a user for app login tests.
6. If email confirmation is enabled, confirm the created user manually before login.

## Auth + RLS behavior
- Public users: read-only dashboard/report/readings.
- Authenticated users: create/update/delete readings.
- Add/Edit/Delete actions are hidden in UI when logged out.
- Server-side RLS enforces the same permissions.
- Login uses `supabase.auth.signInWithPassword`.
- Logout uses `supabase.auth.signOut`.
- Patient photos are stored in Supabase Storage bucket `patient-photos`.
- Only users with `public.profiles.role = 'admin'` can upload/update/delete patient photos.
- Public users can view patient photos.

## Admin setup for photo upload
1. Ensure the logged-in user has a `profiles` row with role `admin`.
2. Example:
   `update public.profiles set role = 'admin' where id = '<auth_user_uuid>';`
3. Re-run [`supabase/migration.sql`](./supabase/migration.sql) after schema/storage policy updates.

## Vercel deployment
1. Push repo to GitHub.
2. Import project into Vercel.
3. Framework preset: `Vite`.
4. Set env vars in Vercel Project Settings:
   - Either `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
   - Or native integration names already present in many projects:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Deploy.

## Notes
- Project URL used: `https://crfrvyvydejlljqxjxgc.supabase.co`
- This implementation does not use MySQL, PHP, Prisma, or Next.js.
