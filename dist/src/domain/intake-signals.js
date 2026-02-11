"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENSITIVITY_FLAGS = exports.EXPOSURE_STATES = exports.EVIDENCE_LEVELS = exports.RISK_LEVELS = exports.INCIDENT_TYPES = void 0;
exports.buildSummary = buildSummary;
exports.INCIDENT_TYPES = [
    'private_case',
    'family_dispute',
    'legal_professional_case',
    'court_proceeding',
    'unknown',
];
exports.RISK_LEVELS = ['low', 'medium', 'high', 'imminent'];
exports.EVIDENCE_LEVELS = [
    'none',
    'messages_only',
    'screenshots',
    'full_device',
    'mixed',
];
exports.EXPOSURE_STATES = ['unknown', 'potential', 'active', 'contained'];
exports.SENSITIVITY_FLAGS = ['emotional_distress'];
function buildSummary(signals) {
    return {
        headline: `${signals.riskLevel.toUpperCase()} risk ${signals.incidentType.replaceAll('_', ' ')}`,
        bullets: [
            `Evidence: ${signals.evidenceLevel.replaceAll('_', ' ')}`,
            `Exposure: ${signals.exposureState.replaceAll('_', ' ')}`,
            `Devices: ${signals.devicesCount}`,
        ],
        recommendedNextStep: signals.riskLevel === 'imminent' || signals.riskLevel === 'high'
            ? 'Prioritize prompt specialist review'
            : 'Follow standard intake review workflow',
    };
}
