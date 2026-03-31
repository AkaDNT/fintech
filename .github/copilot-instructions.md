# Repository instructions

## Monorepo structure

- apps/api is the NestJS HTTP boundary
- apps/worker is the NestJS background worker
- apps/web is the Next.js frontend
- packages/db is the shared Prisma package
- packages/shared contains shared helpers and cross-cutting utilities

## Backend rules

- Keep controllers thin
- Business logic belongs in services
- Use DTO validation and NestJS DI
- Business errors must use AppException + ERROR_CODES
- Preserve traceId from API to queue to worker
- Do not return raw BigInt in API responses

## Worker rules

- Use handler registry pattern for BullMQ jobs
- Avoid ad-hoc Prisma clients inside handlers
- Keep orchestration separate from business logic

## Frontend rules

- Use App Router route groups
- Keep routing/layout in src/app
- Keep feature logic in src/modules
- Shared cross-cutting code lives in src/shared
- Do not scatter fetch calls across pages

## Money rules

- Money amounts stay string at the boundary
- Domain logic may use bigint
- UI formats money only at display time

<!-- GSD Configuration — managed by get-shit-done installer -->
# Instructions for GSD

- Use the get-shit-done skill when the user asks for GSD or uses a `gsd-*` command.
- Treat `/gsd-...` or `gsd-...` as command invocations and load the matching file from `.github/skills/gsd-*`.
- When a command says to spawn a subagent, prefer a matching custom agent from `.github/agents`.
- Do not apply GSD workflows unless the user explicitly asks for them.
- After completing any `gsd-*` command (or any deliverable it triggers: feature, bug fix, tests, docs, etc.), ALWAYS: (1) offer the user the next step by prompting via `ask_user`; repeat this feedback loop until the user explicitly indicates they are done.
<!-- /GSD Configuration -->
