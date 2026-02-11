"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTAKE_ROUTE_BY_TONE = void 0;
exports.resolveIntakeRoute = resolveIntakeRoute;
const decision_1 = require("./decision");
Object.defineProperty(exports, "INTAKE_ROUTE_BY_TONE", { enumerable: true, get: function () { return decision_1.INTAKE_ROUTE_BY_TONE; } });
/**
 * Canonical intake routing.
 * Returns a path segment WITHOUT the language prefix.
 */
function resolveIntakeRoute(result) {
    return (0, decision_1.decideIntake)(result).route;
}
