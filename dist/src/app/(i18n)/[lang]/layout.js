"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LangLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const LanguageProvider_1 = require("@/components/LanguageProvider");
function LangLayout({ children, }) {
    return ((0, jsx_runtime_1.jsx)(LanguageProvider_1.LanguageProvider, { children: children }));
}
