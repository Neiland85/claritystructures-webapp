"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessIntake = assessIntake;
exports.assessIntakeV2 = assessIntakeV2;
exports.assessIntakeWithSignals = assessIntakeWithSignals;
const decision_1 = require("./decision");
const intake_signals_1 = require("./intake-signals");
const map_wizard_to_signals_1 = require("./map-wizard-to-signals");
function assessIntake(result) {
    const decision = (0, decision_1.decideIntake)(result);
    return {
        priority: decision.priority,
        flags: decision.flags,
        actionCode: decision.actionCode,
    };
}
function assessIntakeV2(result) {
    const decision = (0, decision_1.decideIntakeV2)(result);
    return {
        priority: decision.priority,
        flags: decision.flags,
        actionCode: decision.actionCode,
    };
}
function assessIntakeWithSignals(result, options = {}) {
    const useDecisionModelV2 = options.useDecisionModelV2 ?? false;
    const includeDecisionModelVersion = options.includeDecisionModelVersion ?? false;
    const decision = useDecisionModelV2 ? (0, decision_1.decideIntakeV2)(result) : (0, decision_1.decideIntake)(result);
    const signals = (0, map_wizard_to_signals_1.mapWizardToSignals)(result);
    return {
        priority: decision.priority,
        flags: decision.flags,
        actionCode: decision.actionCode,
        signals,
        summary: (0, intake_signals_1.buildSummary)(signals),
        ...(includeDecisionModelVersion
            ? {
                decisionModelVersion: useDecisionModelV2
                    ? decision_1.DECISION_MODEL_VERSION_V2
                    : decision.decisionModelVersion,
            }
            : {}),
    };
}
