'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Wizard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const wizardOptions_1 = require("@/constants/wizardOptions");
function Wizard({ onComplete }) {
    const [clientProfile, setClientProfile] = (0, react_1.useState)(null);
    const [urgency, setUrgency] = (0, react_1.useState)(null);
    const [hasEmotionalDistress, setHasEmotionalDistress] = (0, react_1.useState)(null);
    function submit() {
        if (!clientProfile || !urgency)
            return;
        onComplete({
            clientProfile,
            urgency,
            hasEmotionalDistress: hasEmotionalDistress ?? false,
            incident: 'unspecified',
            devices: 0,
            actionsTaken: [],
            evidenceSources: [],
            objective: 'document'
        });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6 max-w-xl", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-semibold", children: "Tu situaci\u00F3n actual" }), wizardOptions_1.clientProfiles.map(opt => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setClientProfile(opt.value), className: `block w-full text-left p-3 border ${clientProfile === opt.value ? 'border-white' : 'border-neutral-700'}`, children: [(0, jsx_runtime_1.jsx)("div", { children: opt.label }), opt.description && ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-neutral-400", children: opt.description }))] }, opt.value)))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-semibold", children: "Nivel de urgencia" }), wizardOptions_1.urgencyLevels.map(opt => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setUrgency(opt.value), className: `block w-full text-left p-3 border ${urgency === opt.value ? 'border-white' : 'border-neutral-700'}`, children: opt.label }, opt.value)))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-semibold", children: "\u00BFTe est\u00E1 afectando emocionalmente?" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setHasEmotionalDistress(true), children: "S\u00ED" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setHasEmotionalDistress(false), children: "No" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setHasEmotionalDistress(null), children: "Prefiero no responder" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: submit, className: "mt-6 px-4 py-2 bg-white text-black", children: "Continuar" })] }));
}
