import { PrismaClient } from "../../generated/prisma/index";
import type { SlaRepository, SlaTimerSummary } from "@claritystructures/domain";
import {
  SLA_MILESTONES,
  computeDeadline,
  resolveSlaStatus,
} from "@claritystructures/domain";

/**
 * PrismaSlaRepository — manages SLA timer lifecycle for critical intakes.
 *
 * Creates all milestone timers at decision time,
 * completes milestones as they are fulfilled,
 * and queries for breached timers to trigger alerts.
 */
export class PrismaSlaRepository implements SlaRepository {
  constructor(private readonly prisma: Pick<PrismaClient, "slaTimer">) {}

  /**
   * Create all four SLA milestone timers for a critical intake.
   */
  async createTimers(intakeId: string, decisionTimestamp: Date): Promise<void> {
    const data = SLA_MILESTONES.map((milestone) => ({
      intakeId,
      milestone,
      deadlineAt: computeDeadline(decisionTimestamp, milestone),
      status: "pending",
    }));

    await this.prisma.slaTimer.createMany({ data });
  }

  /**
   * Mark a milestone as completed. Updates status to "met" or "breached"
   * based on whether completion is within the deadline.
   */
  async completeMilestone(intakeId: string, milestone: string): Promise<void> {
    const timer = await this.prisma.slaTimer.findUnique({
      where: { intakeId_milestone: { intakeId, milestone } },
    });

    if (!timer) return;

    const now = new Date();
    const status = resolveSlaStatus(timer.deadlineAt, now);

    await this.prisma.slaTimer.update({
      where: { id: timer.id },
      data: { completedAt: now, status },
    });
  }

  /**
   * Get all SLA timers for an intake with resolved statuses.
   */
  async findByIntakeId(intakeId: string): Promise<SlaTimerSummary[]> {
    const timers = await this.prisma.slaTimer.findMany({
      where: { intakeId },
      orderBy: { deadlineAt: "asc" },
    });

    return timers.map((t) => ({
      id: t.id,
      intakeId: t.intakeId,
      milestone: t.milestone,
      deadlineAt: t.deadlineAt,
      completedAt: t.completedAt,
      status: resolveSlaStatus(t.deadlineAt, t.completedAt),
    }));
  }

  /**
   * Find all currently breached timers (pending + past deadline).
   */
  async findBreached(): Promise<SlaTimerSummary[]> {
    const now = new Date();
    const timers = await this.prisma.slaTimer.findMany({
      where: {
        status: "pending",
        deadlineAt: { lt: now },
      },
      orderBy: { deadlineAt: "asc" },
    });

    return timers.map((t) => ({
      id: t.id,
      intakeId: t.intakeId,
      milestone: t.milestone,
      deadlineAt: t.deadlineAt,
      completedAt: t.completedAt,
      status: "breached",
    }));
  }
}
