'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactConfirmation;
const jsx_runtime_1 = require("react/jsx-runtime");
const CONFIRMATION_COPY = {
    basic: {
        title: 'Consulta recibida',
        message: 'Hemos recibido tu consulta. Revisaremos la información y te responderemos por correo electrónico.',
        next: 'Si el caso evoluciona, podrás solicitar una evaluación técnica más profunda.',
    },
    family: {
        title: 'Solicitud recibida',
        message: 'Hemos recibido tu mensaje. En conflictos familiares es importante actuar con cautela.',
        next: 'Evita manipular dispositivos o cuentas hasta recibir indicaciones técnicas.',
    },
    legal: {
        title: 'Contacto registrado',
        message: 'Tu solicitud ha sido registrada para análisis técnico.',
        next: 'La preservación de la cadena de custodia es prioritaria. Te contactaremos con instrucciones.',
    },
    critical: {
        title: 'Situación crítica detectada',
        message: 'Hemos recibido tu solicitud. Este tipo de situaciones se tratan con prioridad.',
        next: 'Si existe riesgo inmediato, evita actuar sin indicaciones técnicas.',
    },
};
function ContactConfirmation({ tone }) {
    const copy = CONFIRMATION_COPY[tone];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 max-w-xl", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold", children: copy.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-300", children: copy.message }), copy.next && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-neutral-400", children: copy.next })), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-neutral-500", children: "Este canal no sustituye asesoramiento legal ni actuaciones de emergencia." })] }));
}
