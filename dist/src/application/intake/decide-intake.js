"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideIntake = decideIntake;
const flow_1 = require("@/domain/flow");
const priority_1 = require("@/domain/priority");
function defaultRecommendedAction(priority) {
    if (priority === 'critical') {
        return 'Immediate human contact and evidence preservation guidance';
    }
    if (priority === 'high') {
        return 'Priority review within 24–48h';
    }
    if (priority === 'medium') {
        return 'Standard review';
    }
    return 'Deferred or informational response';
}
function hasRecommendedAction(assessment) {
    return (typeof assessment.recommendedAction === 'string' &&
        assessment.recommendedAction.length > 0);
}
function decideIntake(payload) {
    const assessment = (0, priority_1.assessIntake)(payload);
    return {
        nextRoute: (0, flow_1.resolveIntakeRoute)(payload),
        priority: assessment.priority,
        flags: assessment.flags,
        recommendedAction: hasRecommendedAction(assessment)
            ? assessment.recommendedAction
            : defaultRecommendedAction(assessment.priority),
    };
}
