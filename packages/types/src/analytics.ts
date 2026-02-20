export const FUNNEL_EVENTS = [
  "funnel.view",
  "wizard.step_view",
  "wizard.step_submit",
  "wizard.risk_classified",
  "wizard.completed",
  "contact.open",
  "contact.submit_attempt",
  "contact.submit_success",
  "contact.submit_error",
  "dpia.open",
  "dpia.accept",
] as const;

export type FunnelEventName = (typeof FUNNEL_EVENTS)[number];

export type FunnelEvent<T extends FunnelEventName = FunnelEventName> =
  Readonly<{
    name: T;
    timestamp: number;
    requestId?: string;
    payload?: Record<string, unknown>;
  }>;
