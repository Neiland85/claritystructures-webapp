"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTAKE_ACTION_CODES = exports.INTAKE_FLAGS = exports.INTAKE_PRIORITIES = exports.INTAKE_STATUSES = exports.INTAKE_TONES = void 0;
/**
 * Intake domain types
 */
exports.INTAKE_TONES = [
    'basic',
    'family',
    'legal',
    'critical',
];
exports.INTAKE_STATUSES = [
    'RECEIVED',
    'ALERT_QUEUED',
    'DONE',
];
exports.INTAKE_PRIORITIES = [
    'low',
    'medium',
    'high',
    'critical',
];
exports.INTAKE_FLAGS = [
    'family_conflict',
    'active_procedure',
    'legal_professional',
    'emotional_distress',
];
exports.INTAKE_ACTION_CODES = [
    'IMMEDIATE_HUMAN_CONTACT',
    'PRIORITY_REVIEW_24_48H',
    'STANDARD_REVIEW',
    'DEFERRED_INFORMATIONAL_RESPONSE',
];
