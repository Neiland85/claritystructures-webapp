"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.POST = POST;
const server_1 = require("next/server");
const nodemailer_1 = __importDefault(require("nodemailer"));
const decision_1 = require("@/domain/decision");
exports.runtime = 'nodejs';
const ACTION_MESSAGE_BY_CODE = {
    IMMEDIATE_HUMAN_CONTACT: 'Immediate human contact and evidence preservation guidance',
    PRIORITY_REVIEW_24_48H: 'Priority review within 24–48h',
    STANDARD_REVIEW: 'Standard review',
    DEFERRED_INFORMATIONAL_RESPONSE: 'Deferred or informational response',
};
async function POST(req) {
    try {
        // 1️⃣ Parse body ONCE
        const body = (await req.json());
        // 2️⃣ Internal assessment (NOT exposed)
        const decision = (0, decision_1.decideIntake)(body);
        // 3️⃣ Prepare email transport
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        // 4️⃣ Build internal email
        const subject = `[${decision.priority.toUpperCase()}] New intake received`;
        const text = `
--- Intake ---
Tone: ${body.tone}
Email: ${body.email}

--- Context ---
Client profile: ${body.clientProfile}
Urgency: ${body.urgency}
Emotional distress: ${body.hasEmotionalDistress ? 'YES' : 'NO'}

--- Assessment ---
Priority: ${decision.priority}
Flags: ${decision.flags.join(', ') || 'none'}
Action code: ${decision.actionCode}
Recommended action: ${ACTION_MESSAGE_BY_CODE[decision.actionCode]}
Decision model version: ${decision.decisionModelVersion}
Route: ${decision.route}

--- Message ---
${body.message}
    `.trim();
        await transporter.sendMail({
            from: 'Clarity Structures <no-reply@claritystructures.com>',
            to: process.env.CONTACT_EMAIL,
            subject,
            text,
        });
        // 5️⃣ Response to client (no internal data leaked)
        return server_1.NextResponse.json({ ok: true });
    }
    catch (error) {
        console.error('[CONTACT_API_ERROR]', error);
        return server_1.NextResponse.json({ ok: false }, { status: 500 });
    }
}
