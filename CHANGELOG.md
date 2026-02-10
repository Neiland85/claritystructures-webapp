# Changelog

All notable changes to this project will be documented in this file.

## v2.0.0-hexagonal
**decisionModelVersion:** `decisionModelVersion: "2.0.0-hexagonal"`

### Added
- Hexagonal architecture boundaries for domain, application, and infrastructure responsibilities.
- Adapter-oriented structure to isolate side effects (alerts, persistence, delivery).
- Explicit domain-level consistency checks for intake and persistence mapping.

### Changed
- Refactored intake orchestration toward ports-and-adapters style separation.
- Updated API/contact handling to rely on domain-focused flow composition.
- Reorganized component and domain responsibilities for clearer dependency direction.

### Fixed
- Reduced risk of cross-layer coupling introducing regression during decision-flow updates.
- Improved consistency handling between runtime intake objects and persistence structures.

## v1.1.0-usecases
**decisionModelVersion:** `decisionModelVersion: "1.1.0-usecases"`

### Added
- Expanded contact and triage use-case coverage across basic, legal, family, and critical paths.
- Evidence preview and confirmation flow improvements for use-case completion.
- Additional consent/version persistence support via migration and consent entities.

### Changed
- Refined wizard step options and flow branching for practical intake scenarios.
- Improved multilingual route handling for use-case-specific entry points.
- Evolved contact form composition for progressive data capture.

### Fixed
- Corrected flow edge cases in wizard transitions and route-level use-case navigation.
- Addressed consistency gaps in intake payload typing and serialization boundaries.

## v1.0.0-decision
**decisionModelVersion:** `decisionModelVersion: "1.0.0-decision"`

### Added
- Initial decision workflow with multi-step triage wizard.
- Contact submission endpoint and alert integration baseline.
- Internationalized public entry points and base legal/consent presentation.

### Changed
- Standardized initial project structure for domain, components, and app routes.
- Established baseline intake model and priority evaluation structure.

### Fixed
- Early stabilization of submission flow and user-facing triage progression behavior.
