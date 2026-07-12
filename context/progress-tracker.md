# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
- Feature 02 (Editor Chrome) — complete

## Current Goal
- Feature 03 (Auth)

## Completed

- Feature 01: Design System — shadcn/ui v4.13.0 installed and configured for Tailwind v4 (base-nova style), dark-only theme tokens in globals.css (app palette + shadcn :root variables, no light mode), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea in components/ui/, lucide-react ^1.24.0 installed, lib/utils.ts cn() helper in place. TypeScript, ESLint, and build clean.
- Feature 02: Editor Chrome — EditorNavbar (fixed-height top bar with left/center/right sections, PanelLeftOpen/PanelLeftClose sidebar toggle, empty right section, dark bg + bottom border) and ProjectSidebar (fixed floating overlay, slides from left without pushing content, isOpen/onClose props, Projects header + close button, My Projects/Shared tabs with empty placeholder states, full-width New Project button with Plus icon) added to components/editor/. EditorShell composes both with shared sidebar state; app/editor/layout.tsx wraps all editor routes. Dialog pattern confirmed ready via existing components/ui/dialog.tsx (title, description, footer actions). TypeScript and ESLint clean.

## In Progress

- None.

## Next Up
- Feature 03: Auth



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
- @clerk/nextjs ^7.2.7 and @clerk/ui ^1.6.7 installed.
- @liveblocks/node installed alongside existing @liveblocks/client, @liveblocks/react, @liveblocks/react-flow, @liveblocks/react-ui. Liveblocks client uses lazy init (getLiveblocks()) to avoid key validation errors at build time.
- @vercel/blob ^2.3.3 installed. BLOB_READ_WRITE_TOKEN set in .env.local.
- @trigger.dev/sdk ^4.4.4 installed. trigger.config.ts reads project ref from TRIGGER_PROJECT_REF env var. TRIGGER_SECRET_KEY must be set in .env.local for triggering tasks from server code. Run `npx trigger.dev@latest dev` for local development; deploy with `npx trigger.dev@latest deploy`.
- Prisma 7.8.0 — generated client goes to app/generated/prisma/; import PrismaClient from @/app/generated/prisma/client (no index.ts in v7). Constructor always requires { adapter } argument. @prisma/adapter-pg used for all connections.
- prisma.config.ts uses schema: "prisma/" (multi-file schema) and reads DATABASE_URL from .env via dotenv.
