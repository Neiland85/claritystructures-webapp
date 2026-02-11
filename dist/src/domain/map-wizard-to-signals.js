"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWizardToSignals = mapWizardToSignals;
function deriveIncidentType(result) {
    switch (result.clientProfile) {
        case 'family_inheritance_conflict':
            return 'family_dispute';
        case 'legal_professional':
            return 'legal_professional_case';
        case 'court_related':
            return 'court_proceeding';
        case 'private_individual':
            return 'private_case';
        default:
            return 'unknown';
    }
}
function deriveRiskLevel(result) {
    switch (result.urgency) {
        case 'time_sensitive':
            return 'medium';
        case 'legal_risk':
            return 'high';
        case 'critical':
            return 'imminent';
        default:
            return 'low';
    }
}
function containsAnyKeyword(values, keywords) {
    return values.some((value) => {
        const normalized = value.toLowerCase();
        return keywords.some((keyword) => normalized.includes(keyword));
    });
}
function deriveEvidenceLevel(result) {
    const normalizedSources = result.evidenceSources.map((source) => source.toLowerCase());
    if (normalizedSources.length === 0) {
        return result.devices > 0 ? 'full_device' : 'none';
    }
    const hasDeviceEvidence = containsAnyKeyword(normalizedSources, [
        'device',
        'phone',
        'computer',
        'laptop',
        'tablet',
        'forensic',
    ]);
    const hasScreenshotEvidence = containsAnyKeyword(normalizedSources, [
        'screenshot',
        'screen capture',
        'screen recording',
    ]);
    const hasMessageEvidence = containsAnyKeyword(normalizedSources, [
        'message',
        'chat',
        'sms',
        'whatsapp',
        'email',
        'dm',
    ]);
    if (hasDeviceEvidence || result.devices > 0) {
        return 'full_device';
    }
    if (hasScreenshotEvidence && !hasMessageEvidence) {
        return 'screenshots';
    }
    if (hasMessageEvidence && !hasScreenshotEvidence) {
        return 'messages_only';
    }
    return 'mixed';
}
function deriveExposureState(result) {
    const actions = result.actionsTaken.map((action) => action.toLowerCase());
    const objective = result.objective.toLowerCase();
    if (containsAnyKeyword(actions, ['secured', 'contained', 'blocked', 'reset']) ||
        objective.includes('prevent')) {
        return 'contained';
    }
    if (containsAnyKeyword(actions, ['monitor', 'review', 'collect'])) {
        return 'potential';
    }
    if (containsAnyKeyword(actions, ['report', 'escalate', 'contact authority'])) {
        return 'active';
    }
    return 'unknown';
}
function deriveSensitivityFlags(result) {
    if (result.hasEmotionalDistress) {
        return ['emotional_distress'];
    }
    return [];
}
function refineRiskLevel(riskLevel, result) {
    if (result.dataSensitivityLevel === 'high' && (riskLevel === 'low' || riskLevel === 'medium')) {
        return 'high';
    }
    return riskLevel;
}
function refineEvidenceLevel(evidenceLevel, result) {
    if (result.hasAccessToDevices === false && evidenceLevel !== 'none') {
        return 'messages_only';
    }
    return evidenceLevel;
}
function refineExposureState(exposureState, result) {
    if (result.isOngoing) {
        return 'active';
    }
    if (exposureState === 'unknown' &&
        (result.estimatedIncidentStart === 'weeks' || result.estimatedIncidentStart === 'months')) {
        return 'potential';
    }
    return exposureState;
}
function mapWizardToSignals(result) {
    const riskLevel = refineRiskLevel(deriveRiskLevel(result), result);
    const evidenceLevel = refineEvidenceLevel(deriveEvidenceLevel(result), result);
    const exposureState = refineExposureState(deriveExposureState(result), result);
    return {
        incidentType: deriveIncidentType(result),
        riskLevel,
        evidenceLevel,
        exposureState,
        sensitivityFlags: deriveSensitivityFlags(result),
        devicesCount: result.devices,
        actionsTaken: result.actionsTaken,
        evidenceSources: result.evidenceSources,
        objective: result.objective,
        incidentSummary: result.incident,
        thirdPartiesInvolved: Boolean(result.thirdPartiesInvolved),
    };
}
