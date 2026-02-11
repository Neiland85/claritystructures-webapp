'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = require("next/navigation");
const Wizard_1 = __importDefault(require("./Wizard"));
const decision_1 = require("@/domain/decision");
function Hero() {
    const router = (0, navigation_1.useRouter)();
    const params = (0, navigation_1.useParams)();
    const lang = params.lang;
    function handleComplete(result) {
        const decision = (0, decision_1.decideIntake)(result);
        router.push('/' + lang + decision.route);
    }
    return (0, jsx_runtime_1.jsx)(Wizard_1.default, { onComplete: handleComplete });
}
