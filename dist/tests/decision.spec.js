"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const decision_js_1 = require("../src/domain/decision.js");
const map_wizard_to_signals_js_1 = require("../src/domain/map-wizard-to-signals.js");
const priority_js_1 = require("../src/domain/priority.js");
function buildResult(overrides = {}) {
    return {
        clientProfile: 'private_individual',
        urgency: 'informational',
        hasEmotionalDistress: false,
        incident: 'incident',
        devices: 1,
        actionsTaken: [],
        evidenceSources: [],
        objective: 'objective',
        ...overrides,
    };
}
(0, node_test_1.default)('returns default low-priority basic route decision', () => {
    const result = (0, decision_js_1.decideIntake)(buildResult());
    strict_1.default.equal(result.route, '/contact/basic');
    strict_1.default.equal(result.priority, 'low');
    strict_1.default.deepEqual(result.flags, []);
    strict_1.default.equal(result.actionCode, 'DEFERRED_INFORMATIONAL_RESPONSE');
    strict_1.default.equal(result.decisionModelVersion, decision_js_1.DECISION_MODEL_VERSION);
});
(0, node_test_1.default)('critical urgency forces critical route and critical action', () => {
    const result = (0, decision_js_1.decideIntake)(buildResult({
        clientProfile: 'family_inheritance_conflict',
        urgency: 'critical',
        hasEmotionalDistress: true,
    }));
    strict_1.default.equal(result.route, '/contact/critical');
    strict_1.default.equal(result.priority, 'critical');
    strict_1.default.deepEqual(result.flags, ['family_conflict', 'emotional_distress']);
    strict_1.default.equal(result.actionCode, 'IMMEDIATE_HUMAN_CONTACT');
});
(0, node_test_1.default)('court-related legal risk yields critical priority with legal route', () => {
    const result = (0, decision_js_1.decideIntake)(buildResult({
        clientProfile: 'court_related',
        urgency: 'legal_risk',
    }));
    strict_1.default.equal(result.route, '/contact/legal');
    strict_1.default.equal(result.priority, 'critical');
    strict_1.default.deepEqual(result.flags, ['active_procedure']);
    strict_1.default.equal(result.actionCode, 'IMMEDIATE_HUMAN_CONTACT');
});
(0, node_test_1.default)('family conflict + time-sensitive yields high priority with family route', () => {
    const result = (0, decision_js_1.decideIntake)(buildResult({
        clientProfile: 'family_inheritance_conflict',
        urgency: 'time_sensitive',
    }));
    strict_1.default.equal(result.route, '/contact/family');
    strict_1.default.equal(result.priority, 'high');
    strict_1.default.deepEqual(result.flags, ['family_conflict']);
    strict_1.default.equal(result.actionCode, 'PRIORITY_REVIEW_24_48H');
});
(0, node_test_1.default)('legal professional only yields low priority and legal route', () => {
    const result = (0, decision_js_1.decideIntake)(buildResult({
        clientProfile: 'legal_professional',
        urgency: 'informational',
    }));
    strict_1.default.equal(result.route, '/contact/legal');
    strict_1.default.equal(result.priority, 'low');
    strict_1.default.deepEqual(result.flags, ['legal_professional']);
    strict_1.default.equal(result.actionCode, 'DEFERRED_INFORMATIONAL_RESPONSE');
});
(0, node_test_1.default)('mapWizardToSignals is deterministic for same input', () => {
    const input = buildResult({
        urgency: 'legal_risk',
        evidenceSources: ['email thread', 'screenshots from app'],
        actionsTaken: ['monitor'],
        devices: 0,
    });
    const first = (0, map_wizard_to_signals_js_1.mapWizardToSignals)(input);
    const second = (0, map_wizard_to_signals_js_1.mapWizardToSignals)(input);
    strict_1.default.deepEqual(first, second);
    strict_1.default.equal(first.riskLevel, 'high');
    strict_1.default.equal(first.evidenceLevel, 'mixed');
    strict_1.default.equal(first.exposureState, 'potential');
});
(0, node_test_1.default)('mapWizardToSignals upgrades riskLevel when data sensitivity is high', () => {
    const result = (0, map_wizard_to_signals_js_1.mapWizardToSignals)(buildResult({
        urgency: 'informational',
        dataSensitivityLevel: 'high',
    }));
    strict_1.default.equal(result.riskLevel, 'high');
});
(0, node_test_1.default)('mapWizardToSignals sets exposureState to active when incident is ongoing', () => {
    const result = (0, map_wizard_to_signals_js_1.mapWizardToSignals)(buildResult({
        actionsTaken: [],
        isOngoing: true,
    }));
    strict_1.default.equal(result.exposureState, 'active');
});
(0, node_test_1.default)('mapWizardToSignals handles missing optional fields safely', () => {
    const result = (0, map_wizard_to_signals_js_1.mapWizardToSignals)(buildResult({
        hasEmotionalDistress: undefined,
        evidenceSources: [],
        actionsTaken: [],
        devices: 0,
    }));
    strict_1.default.equal(result.sensitivityFlags.length, 0);
    strict_1.default.equal(result.evidenceLevel, 'none');
    strict_1.default.equal(result.exposureState, 'unknown');
});
(0, node_test_1.default)('decideIntakeV2 matches V1 for baseline input without refinement fields', () => {
    const input = buildResult({
        clientProfile: 'legal_professional',
        urgency: 'time_sensitive',
        hasEmotionalDistress: true,
    });
    const v1 = (0, decision_js_1.decideIntake)(input);
    const v2 = (0, decision_js_1.decideIntakeV2)(input);
    strict_1.default.deepEqual({
        route: v2.route,
        priority: v2.priority,
        flags: v2.flags,
        actionCode: v2.actionCode,
    }, {
        route: v1.route,
        priority: v1.priority,
        flags: v1.flags,
        actionCode: v1.actionCode,
    });
    strict_1.default.equal(v2.decisionModelVersion, decision_js_1.DECISION_MODEL_VERSION_V2);
    strict_1.default.equal(decision_js_1.DECISION_MODEL_VERSION_V2, 'decision-model/v2');
});
(0, node_test_1.default)('decideIntakeV2 elevates priority only when refinement signals change risk meaningfully', () => {
    const input = buildResult({
        urgency: 'informational',
        dataSensitivityLevel: 'high',
        hasAccessToDevices: false,
        evidenceSources: ['chat export'],
        devices: 0,
    });
    const v1 = (0, decision_js_1.decideIntake)(input);
    const v2 = (0, decision_js_1.decideIntakeV2)(input);
    strict_1.default.equal(v1.priority, 'low');
    strict_1.default.equal(v1.actionCode, 'DEFERRED_INFORMATIONAL_RESPONSE');
    strict_1.default.equal(v2.priority, 'critical');
    strict_1.default.equal(v2.actionCode, 'IMMEDIATE_HUMAN_CONTACT');
    strict_1.default.equal(v2.route, v1.route);
    strict_1.default.deepEqual(v2.flags, v1.flags);
});
(0, node_test_1.default)('assessIntake default behavior remains unchanged when using signal-enabled helper', () => {
    const input = buildResult({
        clientProfile: 'family_inheritance_conflict',
        urgency: 'time_sensitive',
    });
    const baseline = (0, priority_js_1.assessIntake)(input);
    const withSignals = (0, priority_js_1.assessIntakeWithSignals)(input);
    strict_1.default.deepEqual(baseline, {
        priority: 'high',
        flags: ['family_conflict'],
        actionCode: 'PRIORITY_REVIEW_24_48H',
    });
    strict_1.default.deepEqual({
        priority: withSignals.priority,
        flags: withSignals.flags,
        actionCode: withSignals.actionCode,
    }, baseline);
});
(0, node_test_1.default)('assessIntakeWithSignals can expose decisionModelVersion and opt into V2', () => {
    const input = buildResult({
        urgency: 'informational',
        dataSensitivityLevel: 'high',
    });
    const v1Default = (0, priority_js_1.assessIntakeWithSignals)(input, { includeDecisionModelVersion: true });
    const v2 = (0, priority_js_1.assessIntakeWithSignals)(input, {
        useDecisionModelV2: true,
        includeDecisionModelVersion: true,
    });
    strict_1.default.equal(v1Default.decisionModelVersion, decision_js_1.DECISION_MODEL_VERSION);
    strict_1.default.equal(v2.decisionModelVersion, decision_js_1.DECISION_MODEL_VERSION_V2);
    strict_1.default.equal(v1Default.priority, 'low');
    strict_1.default.equal(v2.priority, 'critical');
});
