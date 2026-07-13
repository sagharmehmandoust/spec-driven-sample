# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
- Feature 04 (Project Dialogs) — complete

## Current Goal
- None

## Completed

- Feature 01: Design System — shadcn/ui v4.13.0 installed and configured for Tailwind v4 (base-nova style), dark-only theme tokens in globals.css (app palette + shadcn :root variables, no light mode), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea in components/ui/, lucide-react ^1.24.0 installed, lib/utils.ts cn() helper in place. TypeScript, ESLint, and build clean.
- Feature 02: Editor Chrome — EditorNavbar (fixed-height top bar with left/center/right sections, PanelLeftOpen/PanelLeftClose sidebar toggle, empty right section, dark bg + bottom border) and ProjectSidebar (fixed floating overlay, slides from left without pushing content, isOpen/onClose props, Projects header + close button, My Projects/Shared tabs with empty placeholder states, full-width New Project button with Plus icon) added to components/editor/. EditorShell composes both with shared sidebar state; app/editor/layout.tsx wraps all editor routes. Dialog pattern confirmed ready via existing components/ui/dialog.tsx (title, description, footer actions). TypeScript and ESLint clean.
- Feature 03: Auth — Clerk CLI linked to app_3GOtnxxrgcGD7y22I6sFxqZzkAv. @clerk/nextjs ^7.5.17 and @clerk/ui installed. proxy.ts protects all routes except public auth paths (from NEXT_PUBLIC_CLERK_SIGN_IN_URL / NEXT_PUBLIC_CLERK_SIGN_UP_URL) with /__clerk/:path* matcher. ClerkProvider in root layout uses Clerk dark theme + app CSS variable overrides (no hardcoded colors), Geist Sans via fontFamily. AuthShell 50/50 two-panel layout: tinted left panel (bg-auth-panel) with logo, headline, and icon feature list; dark right panel with centered Clerk form; form-only on small screens. Home redirects authenticated users to /editor and unauthenticated to /sign-in. UserButton in editor navbar right section. clerk doctor clean; build passes.
- Feature 04: Project Dialogs — implemented `/editor` home CTA and Create/Rename/Delete dialogs with a dedicated `useProjectDialogs` hook. Sidebar is now wired to owned-only rename/delete actions plus mobile scrim/outside-close; slug preview updates live; no API calls or persistence.

## In Progress

- None.

## Next Up
- None.



## Open Questions

- None yet.

## Architecture Decisions

- shadcn/ui over Tailwind v4 (CSS-based token config via @theme inline in globals.css, no tailwind.config.js).
- Dark-only theme: all shadcn :root variables set to dark values directly — no .dark class switching.
- Do not modify generated components/ui/* files after shadcn installation.
- Next.js 16 uses proxy.ts (not middleware.ts) — same API, renamed to reflect its purpose.

## Session Notes

- Using Next.js 16.2.4 with React 19 and Tailwind CSS v4.
- shadcn/ui v4.13.0 over Tailwind v4 (CSS-based token config via @theme inline in globals.css, no tailwind.config.js).
- lucide-react ^1.24.0 installed as a direct dependency.
- @clerk/nextjs ^7.5.17 and @clerk/ui installed. Clerk linked via CLI to Sample Spec-driven (app_3GOtnxxrgcGD7y22I6sFxqZzkAv).
- @liveblocks/node installed alongside existing @liveblocks/client, @liveblocks/react, @liveblocks/react-flow, @liveblocks/react-ui. Liveblocks client uses lazy init (getLiveblocks()) to avoid key validation errors at build time.
- @vercel/blob ^2.3.3 installed. BLOB_READ_WRITE_TOKEN set in .env.local.
- @trigger.dev/sdk ^4.4.4 installed. trigger.config.ts reads project ref from TRIGGER_PROJECT_REF env var. TRIGGER_SECRET_KEY must be set in .env.local for triggering tasks from server code. Run `npx trigger.dev@latest dev` for local development; deploy with `npx trigger.dev@latest deploy`.
- Prisma 7.8.0 — generated client goes to app/generated/prisma/; import PrismaClient from @/app/generated/prisma/client (no index.ts in v7). Constructor always requires { adapter } argument. @prisma/adapter-pg used for all connections.
- prisma.config.ts uses schema: "prisma/" (multi-file schema) and reads DATABASE_URL from .env via dotenv.
