# Hexagonal Architecture Visual Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        PRESENTATION LAYER                                │
│                     (Next.js, React Components)                          │
│                    Cognitive Load: ⭐ (Very High)                        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │                      APPLICATION LAYER                              │ │
│  │                  (API Routes, Use Case Orchestration)               │ │
│  │                   Cognitive Load: ⭐⭐ (High)                        │ │
│  │                                                                     │ │
│  │  ┌────────────────────────────────────────────────────────────┐   │ │
│  │  │                                                             │   │ │
│  │  │              INFRASTRUCTURE ADAPTERS                        │   │ │
│  │  │         (Prisma, SMTP, File System, APIs)                  │   │ │
│  │  │            Cognitive Load: ⭐⭐⭐ (Medium)                   │   │ │
│  │  │                                                             │   │ │
│  │  │  ┌────────────────────────────────────────────────────┐   │   │ │
│  │  │  │                                                     │   │   │ │
│  │  │  │                    PORTS                            │   │   │ │
│  │  │  │         (IntakeRepository, Notifier, Audit)        │   │   │ │
│  │  │  │          Cognitive Load: ⭐⭐⭐⭐ (Low)              │   │   │ │
│  │  │  │                                                     │   │   │ │
│  │  │  │  ┌──────────────────────────────────────────┐     │   │   │ │
│  │  │  │  │                                           │     │   │   │ │
│  │  │  │  │          DOMAIN CORE                      │     │   │   │ │
│  │  │  │  │    (Business Rules, Decision Logic)       │     │   │   │ │
│  │  │  │  │   Cognitive Load: ⭐⭐⭐⭐⭐ (Very Low)     │     │   │   │ │
│  │  │  │  │                                           │     │   │   │ │
│  │  │  │  │  • decideIntake()                         │     │   │   │ │
│  │  │  │  │  • assessIntake()                         │     │   │   │ │
│  │  │  │  │  • resolveIntakeRoute()                   │     │   │   │ │
│  │  │  │  │  • Pure functions                         │     │   │   │ │
│  │  │  │  │  • No side effects                        │     │   │   │ │
│  │  │  │  │  • Framework agnostic                     │     │   │   │ │
│  │  │  │  │                                           │     │   │   │ │
│  │  │  │  └──────────────────────────────────────────┘     │   │   │ │
│  │  │  │                                                     │   │   │ │
│  │  │  └────────────────────────────────────────────────────┘   │   │ │
│  │  │                                                             │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

                          DEPENDENCY RULE
                    ═══════════════════════════════
                    Outer layers depend on inner layers
                    Inner layers never depend on outer layers
                    All dependencies point INWARD ──→ 🎯
```

## Layer Responsibilities

### 🎯 Domain Core (Center)

**Location:** `packages/domain/src/`  
**Dependencies:** None (Pure TypeScript)  
**Exports:**

- Business logic functions
- Domain types and primitives
- Decision algorithms
- Validation rules

**Example:**

```typescript
export function decideIntake(result: WizardResult): IntakeDecision {
  // Pure business logic
  // No database, no HTTP, no framework
}
```

---

### 🔌 Ports (Interface Layer)

**Location:** `packages/domain/src/ports.ts`  
**Dependencies:** Domain types only  
**Exports:**

- Repository interfaces
- Notifier interfaces
- Audit trail interfaces

**Example:**

```typescript
export interface IntakeRepository {
  create(input: ContactIntakeInput): Promise<IntakeRecord>;
  findById(id: string): Promise<IntakeRecord | null>;
}
```

---

### 🔧 Infrastructure Adapters

**Location:** `packages/infra-*/`  
**Dependencies:** Domain ports + External libraries  
**Implements:**

- Prisma repository adapter
- SMTP notifier adapter
- Console audit adapter

**Example:**

```typescript
export class PrismaIntakeRepository implements IntakeRepository {
  // Implements domain port using Prisma
}
```

---

### 🎬 Application Layer

**Location:** `apps/web/src/application/` (to be created)  
**Dependencies:** Domain + Ports  
**Orchestrates:**

- Use case execution
- Transaction boundaries
- Cross-cutting concerns

**Example:**

```typescript
export class SubmitIntakeUseCase {
  async execute(input: ContactIntakeInput): Promise<IntakeRecord> {
    // Orchestrate domain + infrastructure
  }
}
```

---

### 🖥️ Presentation Layer

**Location:** `apps/web/src/app/`, `apps/web/src/components/`  
**Dependencies:** Application layer  
**Handles:**

- HTTP requests/responses
- UI rendering
- User input validation
- Framework-specific concerns

---

## Dependency Flow

```
HTTP Request
    │
    ▼
[API Route Handler]  ← Presentation Layer
    │
    ▼
[Use Case]           ← Application Layer
    │
    ├──→ [Domain Logic]      ← Domain Core
    │
    └──→ [Repository Port]   ← Ports
            │
            ▼
        [Prisma Adapter]     ← Infrastructure
            │
            ▼
        [Database]           ← External System
```

---

## Package Structure

```
 claritystructures-webapp/
 ├── packages/
 │   ├── domain/              ← 🎯 CORE (innermost)
 │   │   └── src/
 │   │       ├── decision.ts
 │   │       ├── ports.ts     ← 🔌 PORTS
 │   │       └── index.ts
 │   │
 │   ├── infra-notifications/ ← 🔧 ADAPTERS
 │   │   └── src/
 │   │       ├── mail/notifier.ts
 │   │       ├── audit/console.audit.ts
 │   │       └── index.ts
 │   │
 │   └── infra-persistence/   ← 🔧 ADAPTERS
 │       ├── prisma/
 │       │   └── schema.prisma
 │       └── src/
 │           ├── repositories/intake.repository.ts
 │           └── index.ts
 │
 └── apps/
     └── web/
         └── src/
             ├── app/api/     ← 🖥️ PRESENTATION
             ├── application/ ← 🎬 APPLICATION
             │   ├── di-container.ts
             │   └── use-cases/
             └── components/  ← 🖥️ PRESENTATION
```

---

## Cognitive Load Summary

| Layer          | Stars      | Complexity | Why                          |
| -------------- | ---------- | ---------- | ---------------------------- |
| Domain Core    | ⭐⭐⭐⭐⭐ | 2/10       | Pure logic, no side effects  |
| Ports          | ⭐⭐⭐⭐   | 3/10       | Simple interfaces            |
| Infrastructure | ⭐⭐⭐     | 5/10       | External library APIs        |
| Application    | ⭐⭐       | 6/10       | Orchestration complexity     |
| Presentation   | ⭐         | 8/10       | Framework + user interaction |

**Goal:** Keep complexity at the edges, simplicity at the core.

---

_This diagram represents the current state and recommended structure of the Clarity Structures hexagonal architecture._
