Apply to: apps/worker/\*\*

- Worker is a Nest application context, not an HTTP app
- Use BullMQ handler registry pattern
- Pass traceId through job data
- Keep orchestration in workers and business logic in handlers/services
- Avoid global singletons when a provider can be injected
