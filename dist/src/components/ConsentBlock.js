'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConsentBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
const CONSENT_COPY = {
    basic: {
        text: 'Entiendo que esta consulta es informativa y no constituye asesoramiento legal ni pericial.',
    },
    family: {
        text: 'Declaro que no manipularé ni accederé a dispositivos, cuentas o pruebas hasta recibir indicaciones técnicas.',
        warning: 'La manipulación de pruebas puede afectar gravemente a su validez legal.',
    },
    legal: {
        text: 'Confirmo que comprendo la importancia de la cadena de custodia y seguiré estrictamente las indicaciones técnicas.',
        warning: 'Una actuación incorrecta puede invalidar pruebas en sede judicial.',
    },
    critical: {
        text: 'Reconozco que esta es una situación crítica y acepto actuar conforme a las indicaciones técnicas inmediatas.',
        warning: 'Si existe riesgo para personas o pruebas, actúe con la máxima urgencia.',
    },
};
function ConsentBlock({ tone, checked, onChange, }) {
    const copy = CONSENT_COPY[tone];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 border border-neutral-700 p-4 rounded", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-start gap-3 text-sm", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked), className: "mt-1", required: true }), (0, jsx_runtime_1.jsx)("span", { children: copy.text })] }), copy.warning && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-red-400", children: copy.warning }))] }));
}
