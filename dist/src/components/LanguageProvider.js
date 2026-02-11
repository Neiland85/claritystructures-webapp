'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageProvider = LanguageProvider;
exports.useLang = useLang;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const LanguageContext = (0, react_1.createContext)('es');
function LanguageProvider({ children }) {
    const pathname = (0, navigation_1.usePathname)();
    const lang = pathname.startsWith('/en') ? 'en' : 'es';
    return ((0, jsx_runtime_1.jsx)(LanguageContext.Provider, { value: lang, children: children }));
}
function useLang() {
    return (0, react_1.useContext)(LanguageContext);
}
