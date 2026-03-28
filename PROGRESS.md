# PROGRESS.md — Infrawatch Build State
> This file is updated at the END of every Claude Code session.
> It is the source of truth for what exists, what works, and what comes next.
> Read this at the START of every session before doing anything.

---

## Current Phase
**Phase 0 — Foundation**

## Current Status
🔵 Partially complete — web scaffold done, auth and dashboard shell working

---

## What Has Been Built

### Session 1 — Monorepo + Next.js scaffold + auth + Docker Compose

**Monorepo**
- Turborepo root with `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `.npmrc`
- Full directory skeleton: `apps/`, `packages/`, `proto/`, `deploy/`, `docs/`, `agent/`, `consumers/`
- pnpm workspaces with root-level turbo tasks

**apps/web (Next.js 16.2.1)**
- TypeScript strict mode + `noUncheckedIndexedAccess` + `noImplicitOverride`
- Tailwind CSS v4 with shadcn/ui (Radix preset, Nova theme)
- Turbopack enabled for dev (`next dev --turbopack`)
- Standalone output enabled for Docker

**Database**
- Drizzle ORM with `postgres` driver
- Schema: `organisations`, `users`, `sessions`, `accounts`, `verifications`, `totp_credential`
- `drizzle.config.ts` pointing at `lib/db/schema/index.ts`
- All tables follow CLAUDE.md conventions (id/createdAt/updatedAt/deletedAt/metadata, soft deletes)
- Migration scripts: `db:generate`, `db:migrate`, `db:push`, `db:studio`

**Auth**
- Better Auth v1 with email/password and TOTP two-factor plugin
- `lib/auth/index.ts` — server-side auth config with Drizzle adapter
- `lib/auth/client.ts` — client-side auth hooks (`signIn`, `signOut`, `signUp`, `useSession`)
- API route: `app/api/auth/[...all]/route.ts`

**Pages**
- `/` → redirects to `/login`
- `(auth)/login` — login form with Zod validation, React Hook Form
- `(auth)/register` — register form, posts to Better Auth
- `(setup)/onboarding` — org creation wizard, creates organisation and links user as `super_admin`
- `(dashboard)/dashboard` — overview placeholder
- `(dashboard)/hosts`, `alerts`, `certificates`, `service-accounts`, `bundlers`, `runbooks`, `tasks`, `team`, `settings` — all placeholder pages

**Components**
- `components/shared/sidebar.tsx` — shadcn Sidebar with all nav sections (Monitoring, Tooling, Administration)
- `components/shared/topbar.tsx` — header with user dropdown + sign out
- `components/shared/query-provider.tsx` — TanStack Query provider
- `components/ui/` — shadcn primitives: button, input, label, card, form, separator, dropdown-menu, avatar, badge, tooltip, dialog, alert-dialog, sheet, sidebar, navigation-menu

**Infrastructure**
- `docker-compose.single.yml` — TimescaleDB/PostgreSQL + Next.js
- `apps/web/Dockerfile` — multi-stage build (deps → builder → runner), node:22-alpine
- `.env.example` with all required variables documented

**Build state**
- `npm run build` (via turbo) — zero errors
- `eslint` — zero warnings
- `tsc --noEmit` — zero errors

---

## Decisions Made This Far (beyond CLAUDE.md)

1. **Next.js 16.2.1** — Latest stable at time of session (not 15.x as originally specified — user confirmed latest always preferred)
2. **Tailwind CSS v4** — create-next-app installs this; shadcn Nova preset works with it
3. **shadcn Nova/Radix preset** — chosen as default; can be changed before public release
4. **Better Auth v1 Drizzle adapter** — `better-auth/adapters/drizzle` (built-in), not `@auth/drizzle-adapter` (Auth.js)
5. **Zod v4** — uses `.issues` not `.errors` on `ZodError`
6. **No React Compiler** — disabled at create-next-app prompt; not needed yet
7. **Organisations managed independently** — Better Auth handles user/session/account tables; organisation linking is done via our own `users.organisation_id` column
8. **TOTP backup codes** — stored as serialised text in `totp_credential.backup_codes`; no separate table
9. **Turbopack enabled for dev and build** — user preference

---

## Known Issues / Technical Debt

- `apps/web/.gitignore` ignores `.env*` (except `.env.example`) — `.env.local` is local dev only; Docker compose uses environment variables directly
- The `(dashboard)` route group renders at `/dashboard`, `/hosts`, etc. (no `/dashboard/` prefix for sub-pages) — this is intentional for cleaner URLs but should be confirmed with UX
- No middleware for auth protection yet — any route is accessible without login; add route protection in Session 2 or 3
- No database migration has been run — `drizzle-kit push` or `drizzle-kit migrate` needed against a live DB
- Docker Compose does not auto-run migrations on startup — needs an entrypoint script or migration job

---

## Blockers

_None._

---

## What The Next Session Should Build

**Session 2 — User management, roles, teams, feature flags, licence scaffold**

Goal: Complete Phase 0 with full user/team management UI, RBAC enforcement, feature flag system, and licence key validation scaffold.

Steps:
1. Add auth middleware (`middleware.ts`) — protect dashboard routes, redirect unauthenticated to `/login`, redirect users without org to `/onboarding`
2. User management UI — list users, invite by email, change role, deactivate
3. Team / resource group schema + UI scaffold (tags-based)
4. Feature flag system — server-side function `hasFeature(session, feature)` based on licence tier
5. Licence key validation scaffold — signed JWT, offline-capable, bundled public key
6. System settings page — org name/slug, licence key entry
7. Profile page — change name, change password, setup/remove TOTP
8. Generate and run initial Drizzle migrations

Definition of done:
- Unauthenticated users cannot access dashboard routes
- Users without an org are redirected to onboarding
- Admin can view and manage team members
- Feature flag functions exist and are used to gate UI elements
- Licence key can be entered and validated (even if validation is stub)
- `npm run build` passes with zero errors/warnings

---

## Phase Completion Checklist

### Phase 0 — Foundation
- [x] Monorepo scaffold (Turborepo)
- [x] Next.js app with shadcn/ui + Tailwind
- [x] PostgreSQL + Drizzle + migrations pipeline
- [x] Docker Compose single-node
- [ ] CI pipeline (GitHub Actions)
- [x] Better Auth — email/password + TOTP
- [x] Organisation + user schema
- [ ] Basic RBAC (roles + permissions)
- [ ] User management UI
- [ ] Feature flag system
- [ ] Licence key validation scaffold
- [ ] System health / about page

### Phase 1 — Agent & Host Inventory
- [ ] Go agent scaffold
- [ ] Proto definitions
- [ ] gRPC ingest service
- [ ] Agent registration + approval flow
- [ ] Heartbeat + online/offline detection
- [ ] mTLS identity
- [ ] Agent self-update mechanism
- [ ] Redpanda integration
- [ ] Metrics consumer
- [ ] Host inventory UI
- [ ] Real-time status indicators

### Phase 2 — Monitoring & Alerting
- [ ] Check definition system
- [ ] Check types (shell/port/process/http/file)
- [ ] TimescaleDB continuous aggregates
- [ ] Metric retention policies
- [ ] Metric graphs (Recharts)
- [ ] Alert rule builder
- [ ] Alert state machine
- [ ] Notification channels (email/webhook/Slack)
- [ ] Alert silencing + acknowledgement
- [ ] Alert history

### Phase 3 — Certificate Management
- [ ] Agent-side cert discovery
- [ ] Certificate parser
- [ ] Certificate inventory UI
- [ ] Expiry alerting
- [ ] CSR generation wizard
- [ ] Approval workflow
- [ ] Internal CA management

### Phase 4 — Service Accounts & Identity
- [ ] Service account inventory
- [ ] Expiry tracking + alerting
- [ ] SSH key inventory
- [ ] LDAP/AD integration

### Phase 5 — Infrastructure Tooling
- [ ] Jenkins plugin bundler (port existing)
- [ ] Docker image bundler
- [ ] Ansible collection bundler
- [ ] Terraform provider bundler
- [ ] Runbook library
- [ ] Scheduled task runner

### Phase 6 — Enterprise
- [ ] SAML 2.0
- [ ] OIDC
- [ ] Advanced RBAC + resource scoping
- [ ] Audit log
- [ ] Compliance packs
- [ ] White labelling

### Phase 7 — Cloud SaaS
- [ ] Multi-tenant hardening
- [ ] Usage metering
- [ ] Billing (Stripe)
- [ ] Customer portal
