"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmitIntakeUseCase = createSubmitIntakeUseCase;
function createSubmitIntakeUseCase(deps) {
    return async function submitIntake(command) {
        const submittedAt = (deps.now ?? (() => new Date()))().toISOString();
        const actor = command.requestedBy ?? 'system';
        const decision = deps.decideIntake(command.payload);
        const { id } = await deps.intakeRepository.save({
            payload: command.payload,
            decision,
            submittedAt,
        });
        await deps.notifier.intakeSubmitted({
            intakeId: id,
            payload: command.payload,
            decision,
        });
        await deps.auditTrail.record({
            action: 'intake.submitted',
            intakeId: id,
            actor,
            occurredAt: submittedAt,
            payload: command.payload,
            decision,
        });
        return {
            id,
            nextRoute: decision.nextRoute,
            decision,
        };
    };
}
