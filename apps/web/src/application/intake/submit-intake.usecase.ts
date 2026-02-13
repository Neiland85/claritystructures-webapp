import type { IntakePriority } from '@claritystructures/domain';

export type IntakeDecision = {
  nextRoute: string;
  priority: IntakePriority;
  flags: string[];
  recommendedAction: string;
};

export type SubmitIntakeCommand<TPayload> = {
  payload: TPayload;
  requestedBy?: string;
};

export type IntakeRecord<TPayload> = {
  payload: TPayload;
  decision: IntakeDecision;
  submittedAt: string;
};

export type SubmitIntakeResult = {
  id: string;
  nextRoute: string;
  decision: IntakeDecision;
};

export interface IntakeRepository<TPayload> {
  save(record: IntakeRecord<TPayload>): Promise<{ id: string }>;
}

export interface Notifier<TPayload> {
  intakeSubmitted(event: {
    intakeId: string;
    payload: TPayload;
    decision: IntakeDecision;
  }): Promise<void>;
}

export interface AuditTrail<TPayload> {
  record(entry: {
    action: 'intake.submitted';
    intakeId: string;
    actor: string;
    occurredAt: string;
    payload: TPayload;
    decision: IntakeDecision;
  }): Promise<void>;
}

export type DecideIntake<TPayload> = (payload: TPayload) => IntakeDecision;

export type SubmitIntakeDependencies<TPayload> = {
  decideIntake: DecideIntake<TPayload>;
  intakeRepository: IntakeRepository<TPayload>;
  notifier: Notifier<TPayload>;
  auditTrail: AuditTrail<TPayload>;
  now?: () => Date;
};

export function createSubmitIntakeUseCase<TPayload>(
  deps: SubmitIntakeDependencies<TPayload>
) {
  return async function submitIntake(
    command: SubmitIntakeCommand<TPayload>
  ): Promise<SubmitIntakeResult> {
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
