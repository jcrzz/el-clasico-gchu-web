<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EL CLÁSICO

Official site for a rock band from Gualeguaychú, Argentina. One Spanish (es-AR) landing page plus a protected content panel at `/admin`. All visible copy is Spanish unless you are adding tooling.

## Commands

- Requires Node 20.9+. `npm run dev` works with **zero env vars**: missing Supabase credentials switch `lib/data.ts` to `lib/mock-data.ts`.
- Verify with `npm run lint`, `npx tsc --noEmit`, `npm run build`. There is no `npm test` / `npm run typecheck`, and no CI.
- Browser QA needs a server on `http://localhost:3000` and **Google Chrome** installed: the scripts launch Playwright with `channel: "chrome"`, not bundled Chromium.
  - `node scripts/audit.mjs` — overflow, mobile menu and console errors at 320–2560 px.
  - `node scripts/review.mjs` — refreshes `.screens/` (tracked in git).
  - `node scripts/links.mjs` — local link status.
- `node scripts/og-image.mjs` and `node scripts/press-kit.mjs` regenerate tracked assets (`public/og-el-clasico.png`, `app/apple-icon.png`, `public/press/*`). Don't hand-edit those.

## Architecture

- `app/page.tsx` composes the landing sections; `app/layout.tsx` owns fonts, metadata, viewport and grain.
- Dynamic content (shows, gallery, EPK, settings, album) enters through `getSiteData()` in `lib/data.ts`. It is `"use cache"` + `cacheLife("hours")` and tagged `site-data`, `shows`, `gallery`, `epk`. Sections receive props; keep it that way. History/Hermandad copy is hardcoded in their components.
- Supabase is optional for the public site. `getSupabaseServer()` returns `null` without env vars, so `/admin` falls back to a development-only demo mode when Supabase is absent. There is no demo bypass in production.
- `/admin/login` is outside the protected route group. `proxy.ts` guards `/admin` and each Server Action re-checks the session in `lib/admin/auth.ts`. `ADMIN_EMAILS` is mandatory in production; with Supabase configured but no `SUPABASE_SERVICE_ROLE_KEY` the panel is read-only.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Admin reads/writes use `lib/supabase/admin.ts`; gallery and EPK uploads use server-generated signed URLs plus browser `uploadToSignedUrl`, avoiding Vercel’s Server Action body limit. Keep public Storage URLs allowed in `next.config.ts`.
- DB rows are snake_case and mapped to camelCase in `lib/content-mappers.ts`, shared by `lib/data.ts` and `lib/admin/data.ts`. Only `shows`, `gallery_images` and `epk_content` have tables; the album and site settings come from `lib/mock-data.ts`. Gallery `src: null` falls back to custom SVG art.
- `supabase/schema.sql` owns tables, public-read RLS policies and the public `gallery` / `press` Storage buckets. `lib/admin/actions/content.ts` writes shows, gallery metadata/order and EPK rows, then calls `updateTag`.
- Contact uses shared logic in `lib/email/contact.ts`: the visible form calls `app/actions/contact.ts`; `app/api/contact/route.ts` keeps a JSON endpoint. Dev returns `{ ok: true, demo: true }` without `RESEND_API_KEY`; production returns `503` by design.
- Canonical URL/SEO strings live in `lib/site.ts`; `NEXT_PUBLIC_SITE_URL` overrides the default.

## Conventions

- Art direction is "el afiche mal impreso": square corners, editorial grid, bone display type, misregistered fire-red layers, analog grain. Use tokens from `app/globals.css` (`ink`, `carbon`, `surface`, `bone`, `ash`, `steel`, `fire`, `ember`, `amber`, `wa`); green `wa` is only for WhatsApp.
- No stock photography, no generic SaaS cards. Visuals are hand-built SVG scenes in `components/art/`; read `.agents/skills/frontend-design/SKILL.md` before a redesign.
- Use `.display`, `.stencil`, `.mono-label`, `.shell`, `.section`, `.btn*`, `.field`, `.hairline`, `.crop-mark` rather than re-inventing styles.
- Server Components by default. `"use client"` only for interaction (navbar, shows, gallery, music, contact form, timeline, admin managers/provider). Import animation from `motion/react`, not `framer-motion`.
- Use `cn`, `whatsappUrl`, `externalLinkProps` from `lib/utils.ts`; brand icons live in `components/ui/social-icons.tsx`.

## Gotchas

- Cache mutations: in a Server Action use `updateTag("shows")` for read-your-own-writes; in a Route Handler use `revalidateTag("shows", "max")`. Single-argument `revalidateTag(tag)` is deprecated. Tags: `site-data`, `shows`, `gallery`, `epk`.
- `cacheComponents` forbids request APIs inside cached functions; don't put `cookies()`/`headers()` in `getSiteData()`. Admin layouts read cookies inside `<Suspense>` boundaries.
- Demo mode writes text/metadata to `localStorage`; uploaded file previews are session-only blob URLs. Don’t persist blob URLs or treat demo data as production content.
- Admin actions and `lib/admin/data.ts` require the service-role client. Never import `lib/supabase/admin.ts` or other server-only helpers into a Client Component. Server Action references from `lib/admin/actions/*` are safe to import from client components.
- `lib/admin/schemas.ts` validates every admin mutation. Keep client form checks and server Zod schemas in sync when adding fields.
- The tour year is hardcoded as `2026` in hero, shows, gallery, footer, layout metadata and `lib/site.ts`; changing show dates alone won't update the copy.
- `next dev` regenerates the managed block at the top of this file; leave it intact.
- `.screens/` is committed. Section screenshots deliberately hide the fixed header during capture, so a missing header in a tall screenshot is not a bug.
- Launch placeholders live in `lib/mock-data.ts` (WhatsApp `5493446123456`, `@elclasico.banda`, ticket URLs → WhatsApp, Spotify/YouTube → searches, `spotifyEmbedUrl: null`). Don't invent replacements.
- Build emits non-fatal `Failed to find font override values` warnings for Big Shoulders / Stencil; only investigate if fonts actually regress.
- Public deploy is Vercel with the Next.js preset; env vars are documented in `.env.example` and `README.md`.
