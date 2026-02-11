'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/* =========================
   Copy by tone
========================= */
const COPY_BY_TONE = {
    basic: {
        title: 'Consulta inicial',
        hint: 'Esta evaluación es informativa. Si el caso evoluciona, podrás solicitar custodia técnica.',
        cta: 'Enviar consulta',
    },
    family: {
        title: 'Conflicto familiar / herencia',
        hint: 'Este tipo de situaciones suelen implicar riesgos de pérdida o manipulación de pruebas.',
        warning: 'Recomendamos no acceder ni modificar dispositivos hasta recibir asesoramiento técnico.',
        cta: 'Solicitar evaluación',
    },
    legal: {
        title: 'Procedimiento judicial en curso',
        hint: 'Este formulario está orientado a contextos con actuaciones legales ya iniciadas.',
        warning: 'La preservación de la cadena de custodia puede ser determinante en sede judicial.',
        cta: 'Contactar equipo técnico',
    },
    critical: {
        title: 'Situación crítica',
        hint: 'Hemos detectado un contexto de alta sensibilidad legal o emocional.',
        warning: 'Si existe riesgo inmediato para personas o pruebas, actúa con la máxima urgencia.',
        cta: 'Contactar de inmediato',
    },
};
/* =========================
   Component
========================= */
function ContactForm({ tone, context }) {
    const copy = COPY_BY_TONE[tone];
    const [email, setEmail] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)(context ?? '');
    const [sent, setSent] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    message,
                    tone,
                    context,
                }),
            });
            if (!res.ok)
                throw new Error();
            setSent(true);
        }
        catch {
            setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
        }
    }
    if (sent) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-neutral-400 max-w-xl", children: "Hemos recibido tu mensaje. Revisaremos la informaci\u00F3n con atenci\u00F3n." }));
    }
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6 max-w-xl w-full", children: [(0, jsx_runtime_1.jsxs)("header", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold", children: copy.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-neutral-400", children: copy.hint }), 'warning' in copy && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-400", children: copy.warning }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "email", required: true, value: email, onChange: e => setEmail(e.target.value), placeholder: "Correo electr\u00F3nico", className: "w-full p-3 border border-neutral-700 bg-black" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, value: message, onChange: e => setMessage(e.target.value), placeholder: "Cu\u00E9ntanos brevemente lo que est\u00E1 ocurriendo", rows: 5, className: "w-full p-3 border border-neutral-700 bg-black" })] }), error && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: error })), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-6 py-3 bg-white text-black", children: copy.cta })] }));
}
