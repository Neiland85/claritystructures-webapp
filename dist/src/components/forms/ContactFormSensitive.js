'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactFormSensitive;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function ContactFormSensitive({ context }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)('');
    async function submit(e) {
        e.preventDefault();
        await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...context, email, message }),
        });
    }
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: submit, className: "space-y-4 max-w-xl", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Hemos detectado un contexto sensible. Vamos a tratar la informaci\u00F3n con especial cuidado y orden." }), (0, jsx_runtime_1.jsx)("input", { type: "email", required: true, placeholder: "Correo electr\u00F3nico", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full border p-3" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, rows: 4, placeholder: "Cu\u00E9ntanos brevemente lo que est\u00E1 ocurriendo", value: message, onChange: (e) => setMessage(e.target.value), className: "w-full border p-3" }), (0, jsx_runtime_1.jsx)("button", { className: "bg-white text-black px-4 py-2 rounded", children: "Enviar" })] }));
}
