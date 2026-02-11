'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactFormBasic;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function ContactFormBasic({ context }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)('');
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
                    ...context,
                    email,
                    message,
                    tone: 'basic',
                    consent: true,
                    consentVersion: 'v1',
                }),
            });
            if (!res.ok)
                throw new Error();
            setSent(true);
        }
        catch {
            setError('No se pudo enviar. Inténtalo de nuevo.');
        }
    }
    if (sent) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-400", children: "Hemos recibido tu solicitud." }));
    }
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4 max-w-xl", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-neutral-400", children: "Consulta informativa / preventiva." }), (0, jsx_runtime_1.jsx)("input", { type: "email", required: true, placeholder: "Correo electr\u00F3nico", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full border p-3 bg-black" }), (0, jsx_runtime_1.jsx)("textarea", { required: true, rows: 4, placeholder: "Cu\u00E9ntanos brevemente lo que est\u00E1 ocurriendo", value: message, onChange: (e) => setMessage(e.target.value), className: "w-full border p-3 bg-black" }), error && (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-400", children: error }), (0, jsx_runtime_1.jsx)("button", { className: "px-6 py-3 bg-white text-black", children: "Enviar consulta" })] }));
}
