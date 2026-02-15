# ADR-0001: Hexagonal Architecture

## Status

Accepted

## Context

Need a scalable, maintainable architecture for a legal tech intake system.

## Decision

Implement Hexagonal Architecture (Ports & Adapters) with DDD patterns.

## Consequences

### Positive

- Clear separation of concerns
- Easy to test (domain isolated)
- Framework-independent domain logic
- Flexible infrastructure changes

### Negative

- More initial complexity
- Steeper learning curve
- More files/folders

## Implementation

- Domain layer: Pure TypeScript with Value Objects, Events, Specifications
- Ports: Repository interfaces, external service interfaces
- Adapters: Prisma repositories, Next.js routes, email services
