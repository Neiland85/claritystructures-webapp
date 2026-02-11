"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CriticalContactPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const ContactForm_1 = __importDefault(require("@/components/ContactForm"));
function CriticalContactPage({ searchParams, }) {
    return ((0, jsx_runtime_1.jsx)("main", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(ContactForm_1.default, { tone: "critical", context: searchParams?.context }) }));
}
