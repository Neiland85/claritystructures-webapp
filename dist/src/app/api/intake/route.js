"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const submit_intake_usecase_1 = require("@/application/intake/submit-intake.usecase");
const decide_intake_1 = require("@/application/intake/decide-intake");
exports.runtime = 'nodejs';
function isString(value) {
    return typeof value === 'string';
}
function isStringArray(value) {
    return Array.isArray(value) && value.every(isString);
}
function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}
function isBoolean(value) {
    return typeof value === 'boolean';
}
function isSubmitIntakePayload(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const candidate = value;
    return (isString(candidate.clientProfile) &&
        isString(candidate.urgency) &&
        (candidate.hasEmotionalDistress === undefined || isBoolean(candidate.hasEmotionalDistress)) &&
        isString(candidate.incident) &&
        isNumber(candidate.devices) &&
        isStringArray(candidate.actionsTaken) &&
        isStringArray(candidate.evidenceSources) &&
        isString(candidate.objective) &&
        isString(candidate.email) &&
        isString(candidate.message) &&
        isBoolean(candidate.consent));
}
const intakeRepository = {
    async save(record) {
        // Example persistence adapter.
        // Replace with Prisma/DB write.
        console.info('[INTAKE_SAVE]', record);
        return { id: crypto.randomUUID() };
    },
};
const notifier = {
    async intakeSubmitted(event) {
        // Example notifier adapter.
        // Replace with email/queue integration.
        console.info('[INTAKE_NOTIFY]', event.intakeId);
    },
};
const auditTrail = {
    async record(entry) {
        // Example audit adapter.
        // Replace with append-only audit store.
        console.info('[INTAKE_AUDIT]', entry.action, entry.intakeId);
    },
};
const submitIntake = (0, submit_intake_usecase_1.createSubmitIntakeUseCase)({
    decideIntake: decide_intake_1.decideIntake,
    intakeRepository,
    notifier,
    auditTrail,
});
async function POST(request) {
    try {
        const payload = await request.json();
        if (!isSubmitIntakePayload(payload)) {
            return server_1.NextResponse.json({ message: 'Invalid intake payload' }, { status: 400 });
        }
        const result = await submitIntake({
            payload,
            requestedBy: 'api:intake',
        });
        return server_1.NextResponse.json(result, { status: 201 });
    }
    catch (error) {
        console.error('[SUBMIT_INTAKE_ERROR]', error);
        return server_1.NextResponse.json({ message: 'Unable to submit intake' }, { status: 500 });
    }
}
