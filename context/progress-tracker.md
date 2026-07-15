# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
- Feature 09 (Share Dialog) — complete

## Current Goal
- None

## Completed

- Feature 01: Design System — shadcn/ui v4.13.0 installed and configured for Tailwind v4 (base-nova style), dark-only theme tokens in globals.css (app palette + shadcn :root variables, no light mode), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea in components/ui/, lucide-react ^1.24.0 installed, lib/utils.ts cn() helper in place. TypeScript, ESLint, and build clean.
- Feature 02: Editor Chrome — EditorNavbar (fixed-height top bar with left/center/right sections, PanelLeftOpen/PanelLeftClose sidebar toggle, empty right section, dark bg + bottom border) and ProjectSidebar (fixed floating overlay, slides from left without pushing content, isOpen/onClose props, Projects header + close button, My Projects/Shared tabs with empty placeholder states, full-width New Project button with Plus icon) added to components/editor/. EditorShell composes both with shared sidebar state; app/editor/layout.tsx wraps all editor routes. Dialog pattern confirmed ready via existing components/ui/dialog.tsx (title, description, footer actions). TypeScript and ESLint clean.
- Feature 03: Auth — Clerk CLI linked to app_3GOtnxxrgcGD7y22I6sFxqZzkAv. @clerk/nextjs ^7.5.17 and @clerk/ui installed. proxy.ts protects all routes except public auth paths (from NEXT_PUBLIC_CLERK_SIGN_IN_URL / NEXT_PUBLIC_CLERK_SIGN_UP_URL) with /__clerk/:path* matcher. ClerkProvider in root layout uses Clerk dark theme + app CSS variable overrides (no hardcoded colors), Geist Sans via fontFamily. AuthShell 50/50 two-panel layout: tinted left panel (bg-auth-panel) with logo, headline, and icon feature list; dark right panel with centered Clerk form; form-only on small screens. Home redirects authenticated users to /editor and unauthenticated to /sign-in. UserButton in editor navbar right section. clerk doctor clean; build passes.
- Feature 04: Project Dialogs — implemented `/editor` home CTA and Create/Rename/Delete dialogs with a dedicated `useProjectDialogs` hook. Sidebar is now wired to owned-only rename/delete actions plus mobile scrim/outside-close; slug preview updates live; no API calls or persistence.
- Feature 05: Prisma — `prisma/models/project.prisma` defines `Project` (ownerId, name, optional description, DRAFT/ARCHIVED status, canvasJsonPath, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` (composite projectId+email key, cascade delete, indexes on email and projectId+createdAt). `lib/prisma.ts` exports a cached singleton branching on `DATABASE_URL` (Accelerate for `prisma+postgres://`, `@prisma/adapter-pg` otherwise). Initial migration `20260715120012_init_project_models` applied; client generated to `app/generated/prisma/`. `@prisma/extension-accelerate` installed. Build passes.
- Feature 06: Project APIs — REST routes at `GET/POST /api/projects` and `PATCH/DELETE /api/projects/[projectId]`. `lib/api-auth.ts` enforces Clerk auth (401 for unauthenticated). `lib/projects.ts` provides list/create/rename/delete helpers using Prisma with cuid IDs and `Untitled Project` default name. Owner checks on rename/delete return 403 for non-owners. UI not wired yet. Build passes.
- Feature 07: Wire Editor Home — `app/editor/layout.tsx` fetches owned and shared projects server-side via `listOwnedProjects` / `listSharedProjects` and passes them into `EditorShell`. `app/editor/page.tsx` is a server component rendering client `EditorHome` CTA. `hooks/use-project-actions.ts` manages dialog state and project mutations: create generates slug + short suffix room ID, calls `POST /api/projects`, navigates to `/editor/[roomId]`; rename calls `PATCH` and refreshes; delete calls `DELETE`, redirects to `/editor` when deleting the active workspace or refreshes otherwise. Sidebar and dialogs wired to real API data with room ID preview, rename prefill, and delete project name. Build passes.
- Feature 08: Editor Workspace Shell — `app/editor/[roomId]/page.tsx` is a server component that redirects unauthenticated users to `/sign-in` and renders `AccessDenied` for missing or unauthorized projects. `lib/project-access.ts` provides `getCurrentIdentity`, `isProjectOwner`, `isProjectCollaborator`, and `hasProjectAccess` helpers. `components/editor/access-denied.tsx` shows a centered lock icon, message, and link back to `/editor`. `EditorShell` detects the active room from the pathname, shows the project name plus Share and AI sidebar toggle in the navbar, highlights the current room in `ProjectSidebar` with navigation links, and renders `AiSidebarPlaceholder` (right slide-over). Page content is `CanvasPlaceholder` (dark bg-base, centered message). No canvas, Liveblocks, AI chat, or sharing behavior yet. Build passes.
- Feature 09: Share Dialog — Share button in `EditorNavbar` opens `ShareDialog` from `EditorShell`. `hooks/use-share-dialog.ts` manages invite/remove/copy-link state. `GET/POST/DELETE /api/projects/[projectId]/collaborators` list, invite, and remove collaborators with server-side owner enforcement on mutations and project-access checks on reads. `lib/collaborators.ts` handles Prisma CRUD; `lib/clerk-users.ts` enriches collaborator emails with Clerk display names and avatars (email-only fallback when no Clerk user). Owners get invite form, remove actions, and copy-link with temporary `Copied!` feedback; collaborators see a read-only list. `requireIdentity()` added to `lib/api-auth.ts`. Build passes.

## In Progress

- None.

## Next Up
- None yet.



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
- Prisma 7.8.0 — generated client goes to app/generated/prisma/; import PrismaClient from @/app/generated/prisma/client (no index.ts in v7). Constructor always requires { adapter } argument for direct connections; use accelerateUrl + withAccelerate() for prisma+postgres:// URLs. @prisma/adapter-pg used for direct postgres connections; @prisma/extension-accelerate for Accelerate.
- prisma.config.ts uses schema: "prisma/" (multi-file schema) and reads DATABASE_URL from .env via dotenv.
