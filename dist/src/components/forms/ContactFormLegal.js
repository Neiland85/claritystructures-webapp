'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactFormLegal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function ContactFormLegal({ context }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)('');
    async function submit(e) {
        e.preventDefault();
        await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...context, email, role, message }),
        });
    }
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: submit, className: "space-y-4 max-w-xl", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Canal orientado a profesionales legales que requieren soporte t\u00E9cnico y trazabilidad digital." }), (0, jsx_runtime_1.jsx)("input", { type: "email", required: true, placeholder: "Correo profesional", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full border p-3" }), (0, jsx_runtime_1.jsx)("input", { placeholder: "Rol (abogado, perito, fiscal, etc.)", value: role, onChange: (e) => setRole(e.target.value), className: "w-full border p-3" }), (0, jsx_runtime_1.jsx)("textarea", { rows: 4, placeholder: "Contexto t\u00E9cnico o procesal", value: message, onChange: (e) => setMessage(e.target.value), className: "w-full border p-3" }), (0, jsx_runtime_1.jsx)("button", { className: "bg-white text-black px-4 py-2 rounded", children: "Enviar" })] }));
}
