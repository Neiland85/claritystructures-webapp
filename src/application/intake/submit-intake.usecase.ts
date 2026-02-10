export type IntakeDecision = {
  nextRoute: string;
  [key: string]: unknown;
};

export type SubmitIntakeCommand<TPayload> = {
  payload: TPayload;
  requestedBy?: string;
};

export type IntakeRecord<TPayload, TDecision extends IntakeDecision> = {
  payload: TPayload;
  decision: TDecision;
  submittedAt: string;
};

export type SubmitIntakeResult<TDecision extends IntakeDecision> = {
  id: string;
  nextRoute: string;
  decision: TDecision;
};

export interface IntakeRepository<TPayload, TDecision extends IntakeDecision> {
  save(record: IntakeRecord<TPayload, TDecision>): Promise<{ id: string }>;
}

export interface Notifier<TPayload, TDecision extends IntakeDecision> {
  intakeSubmitted(event: {
    intakeId: string;
    payload: TPayload;
    decision: TDecision;
  }): Promise<void>;
}

export interface AuditTrail<TPayload, TDecision extends IntakeDecision> {
  record(entry: {
    action: 'intake.submitted';
    intakeId: string;
    actor: string;
    occurredAt: string;
    payload: TPayload;
    decision: TDecision;
  }): Promise<void>;
}

export type DecideIntake<TPayload, TDecision extends IntakeDecision> = (
  payload: TPayload
) => TDecision;

export type SubmitIntakeDependencies<TPayload, TDecision extends IntakeDecision> = {
  decideIntake: DecideIntake<TPayload, TDecision>;
  intakeRepository: IntakeRepository<TPayload, TDecision>;
  notifier: Notifier<TPayload, TDecision>;
  auditTrail: AuditTrail<TPayload, TDecision>;
  now?: () => Date;
};

export function createSubmitIntakeUseCase<
  TPayload,
  TDecision extends IntakeDecision,
>(deps: SubmitIntakeDependencies<TPayload, TDecision>) {
  return async function submitIntake(
    command: SubmitIntakeCommand<TPayload>
  ): Promise<SubmitIntakeResult<TDecision>> {
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
