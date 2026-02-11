"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCriticalAlert = sendCriticalAlert;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendCriticalAlert({ subject, message }) {
    if (!process.env.ALERT_EMAIL)
        return;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    await transporter.sendMail({
        from: 'Clarity Structures <no-reply@claritystructures.com>',
        to: process.env.ALERT_EMAIL,
        subject,
        text: message,
    });
}
