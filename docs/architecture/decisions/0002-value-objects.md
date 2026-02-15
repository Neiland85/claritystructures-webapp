# ADR-0002: Value Objects for Primitives

## Status

Accepted

## Context

Primitive obsession leads to validation scattered across codebase.

## Decision

Use Value Objects (IntakeId, Email, Priority, Status) instead of primitives.

## Consequences

### Positive

- Validation in one place
- Type safety enforced
- Self-documenting code
- Prevents invalid states

### Negative

- More classes to maintain
- Slight performance overhead (negligible)

## Examples

```typescript
// Before
const email: string = "test@example.com"; // No validation

// After
const email = Email.create("test@example.com"); // Validated
```
