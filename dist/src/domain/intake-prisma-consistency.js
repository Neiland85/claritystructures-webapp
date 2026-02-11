"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intake_records_1 = require("./intake-records");
const toneDomainToPrisma = {
    basic: 'basic',
    family: 'family',
    legal: 'legal',
    critical: 'critical',
};
const priorityDomainToPrisma = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical',
};
const statusDomainToPrisma = {
    RECEIVED: 'RECEIVED',
    ALERT_QUEUED: 'ALERT_QUEUED',
    DONE: 'DONE',
};
const assertSameLiterals = (_a, _b) => {
    void _a;
    void _b;
};
assertSameLiterals(intake_records_1.INTAKE_TONES, Object.values(toneDomainToPrisma));
assertSameLiterals(intake_records_1.INTAKE_PRIORITIES, Object.values(priorityDomainToPrisma));
assertSameLiterals(intake_records_1.INTAKE_STATUSES, Object.values(statusDomainToPrisma));
