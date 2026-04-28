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
   - Copy `.env.example` to `.env`
   - Keep only publishable/anon key in frontend. Never use service role key in `VITE_*`.
3. Start dev server:
   `npm run dev`

## Supabase setup
1. Open SQL editor in your Supabase project.
2. Run [`supabase/migration.sql`](./supabase/migration.sql).
3. Run [`supabase/seed.sql`](./supabase/seed.sql).
4. In Authentication, enable Email/Password provider.
5. Create at least one user for authenticated CRUD tests.

## Auth + RLS behavior
- Public users: read-only dashboard/report/readings.
- Authenticated users: create/update/delete readings.
- Add/Edit/Delete actions are hidden in UI when logged out.
- Server-side RLS enforces the same permissions.

## Vercel deployment
1. Push repo to GitHub.
2. Import project into Vercel.
3. Framework preset: `Vite`.
4. Set env vars in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

## Notes
- Project URL used: `https://crfrvyvydejlljqxjxgc.supabase.co`
- This implementation does not use MySQL, PHP, Prisma, or Next.js.
