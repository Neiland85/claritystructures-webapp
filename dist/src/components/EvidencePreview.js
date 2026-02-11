"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EvidencePreview;
const jsx_runtime_1 = require("react/jsx-runtime");
function EvidencePreview({ data }) {
    return ((0, jsx_runtime_1.jsx)("pre", { className: "text-sm opacity-80 whitespace-pre-wrap", children: JSON.stringify(data, null, 2) }));
}
