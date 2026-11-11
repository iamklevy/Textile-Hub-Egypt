@AGENTS.md

# Project notes

- Trilingual site: every route lives under `src/app/[lang]/` (`en`, `ar`, `zh`). Arabic is RTL, so use logical Tailwind classes (`ms-`, `pe-`, `text-start`), never `ml-`/`pr-`/`text-left`.
- All interface text goes in `src/dictionaries/{en,ar,zh}.ts`. `en.ts` defines the shape; the other two must match it.
- Database values are stable keys from `src/lib/options.ts`; labels are looked up in the dictionaries.
- Supabase is accessed server-side only with the anon key (`src/lib/supabase.ts`). Row-level security in `supabase/schema.sql` is the security boundary: public reads see `status = 'approved'` only, public inserts must be `pending`.
- Without Supabase env vars the app serves `src/lib/demo-data.ts` (demo mode).
- `cacheComponents` is off in `next.config.ts`; listing pages render per request.
- Check changes with `npm run build` and `npm run lint`.
