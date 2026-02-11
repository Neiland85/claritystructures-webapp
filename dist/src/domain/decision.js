"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECISION_MODEL_VERSION_V2 = exports.DECISION_MODEL_VERSION_V1 = exports.DECISION_MODEL_VERSION = exports.INTAKE_ROUTE_BY_TONE = void 0;
exports.decideIntake = decideIntake;
exports.decideIntakeV2 = decideIntakeV2;
const map_wizard_to_signals_1 = require("./map-wizard-to-signals");
exports.INTAKE_ROUTE_BY_TONE = {
    basic: '/contact/basic',
    family: '/contact/family',
    legal: '/contact/legal',
    critical: '/contact/critical',
};
exports.DECISION_MODEL_VERSION = 'decision-model/v1';
exports.DECISION_MODEL_VERSION_V1 = exports.DECISION_MODEL_VERSION;
exports.DECISION_MODEL_VERSION_V2 = 'decision-model/v2';
function decideIntake(result) {
    let score = 0;
    const flags = [];
    let route = exports.INTAKE_ROUTE_BY_TONE.basic;
    if (result.urgency === 'critical') {
        route = exports.INTAKE_ROUTE_BY_TONE.critical;
    }
    else if (result.clientProfile === 'family_inheritance_conflict') {
        route = exports.INTAKE_ROUTE_BY_TONE.family;
    }
    else if (result.clientProfile === 'legal_professional' ||
        result.clientProfile === 'court_related') {
        route = exports.INTAKE_ROUTE_BY_TONE.legal;
    }
    if (result.clientProfile === 'family_inheritance_conflict') {
        score += 3;
        flags.push('family_conflict');
    }
    if (result.clientProfile === 'court_related') {
        score += 4;
        flags.push('active_procedure');
    }
    if (result.clientProfile === 'legal_professional') {
        score += 2;
        flags.push('legal_professional');
    }
    if (result.urgency === 'time_sensitive')
        score += 2;
    if (result.urgency === 'legal_risk')
        score += 4;
    if (result.urgency === 'critical')
        score += 6;
    if (result.hasEmotionalDistress) {
        score += 2;
        flags.push('emotional_distress');
    }
    if (score >= 8) {
        return {
            route,
            priority: 'critical',
            flags,
            actionCode: 'IMMEDIATE_HUMAN_CONTACT',
            decisionModelVersion: exports.DECISION_MODEL_VERSION,
        };
    }
    if (score >= 5) {
        return {
            route,
            priority: 'high',
            flags,
            actionCode: 'PRIORITY_REVIEW_24_48H',
            decisionModelVersion: exports.DECISION_MODEL_VERSION,
        };
    }
    if (score >= 3) {
        return {
            route,
            priority: 'medium',
            flags,
            actionCode: 'STANDARD_REVIEW',
            decisionModelVersion: exports.DECISION_MODEL_VERSION,
        };
    }
    return {
        route,
        priority: 'low',
        flags,
        actionCode: 'DEFERRED_INFORMATIONAL_RESPONSE',
        decisionModelVersion: exports.DECISION_MODEL_VERSION,
    };
}
const PRIORITY_RANK = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
};
function actionCodeFromPriority(priority) {
    switch (priority) {
        case 'critical':
            return 'IMMEDIATE_HUMAN_CONTACT';
        case 'high':
            return 'PRIORITY_REVIEW_24_48H';
        case 'medium':
            return 'STANDARD_REVIEW';
        default:
            return 'DEFERRED_INFORMATIONAL_RESPONSE';
    }
}
function maxPriority(left, right) {
    return PRIORITY_RANK[left] >= PRIORITY_RANK[right] ? left : right;
}
/**
 * Decision model V2 keeps V1 as baseline and applies signal-based refinements
 * only when contextual signal fields provide additional, meaningful context.
 */
function applySignalRefinements(baseline, result) {
    const signals = (0, map_wizard_to_signals_1.mapWizardToSignals)(result);
    const usesRefinedSignalInputs = result.dataSensitivityLevel === 'high' ||
        result.isOngoing === true ||
        result.hasAccessToDevices === false ||
        result.estimatedIncidentStart === 'weeks' ||
        result.estimatedIncidentStart === 'months';
    if (!usesRefinedSignalInputs) {
        return baseline;
    }
    let refinedPriority = baseline.priority;
    if (signals.exposureState === 'active' && baseline.priority !== 'critical') {
        refinedPriority = maxPriority(refinedPriority, 'high');
    }
    if (result.dataSensitivityLevel === 'high' &&
        (signals.riskLevel === 'high' || signals.riskLevel === 'imminent')) {
        refinedPriority = maxPriority(refinedPriority, 'critical');
    }
    if (result.hasAccessToDevices === false &&
        signals.evidenceLevel === 'messages_only' &&
        refinedPriority === 'low') {
        refinedPriority = maxPriority(refinedPriority, 'medium');
    }
    return {
        ...baseline,
        priority: refinedPriority,
        actionCode: actionCodeFromPriority(refinedPriority),
    };
}
function decideIntakeV2(result) {
    const baseline = decideIntake(result);
    const refinedDecision = applySignalRefinements(baseline, result);
    return {
        ...refinedDecision,
        decisionModelVersion: exports.DECISION_MODEL_VERSION_V2,
    };
}
