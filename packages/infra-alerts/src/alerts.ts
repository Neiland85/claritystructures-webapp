import nodemailer from "nodemailer";
import type { WizardResult, IntakeDecision } from "@claritystructures/domain";

type ForensicIntakePayload = {
  result: WizardResult;
  decision: IntakeDecision;
  userEmail: string;
  userPhone?: string;
};

export async function sendForensicIntakeEmail(payload: ForensicIntakePayload) {
  const { result, decision, userEmail, userPhone } = payload;

  const recipient = process.env.ALERT_EMAIL || "admin@claritystructures.com";
  const caseId = `${decision.priority.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT) || 1025,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  const subject = `[FORENSIC-INTAKE] ${decision.priority.toUpperCase()} - ${result.clientProfile.replace(/_/g, " ")}`;

  const reportContent = `
=========================================================
CLARITY STRUCTURES - INFORME PRELIMINAR DE TRIAGE FORENSE
=========================================================
ID CASO: ${caseId}
FECHA: ${new Date().toLocaleString()}
RECEPTOR: ${recipient}

1. DATOS DEL CLIENTE
--------------------
Email de contacto: ${userEmail}
Teléfono seguro: ${userPhone || "No proporcionado"}
Perfil declarado: ${result.clientProfile}
Nivel de urgencia: ${result.urgency}

2. ANÁLISIS DE SEÑALES (SISTEMA CANÓNICO)
-----------------------------------------
[URGENTE] Riesgo Integridad Física: ${result.physicalSafetyRisk ? "SÍ - NIVEL ALTO" : "No detectado"}
[ALERTA] Riesgo Financiero/Herencia: ${result.financialAssetRisk ? "SÍ - PRIORIDAD ALTA" : "No detectado"}
[ACCESO] Compromiso de Credenciales: ${result.attackerHasPasswords ? "SÍ - CAMBIO CLAVES RECOMENDADO" : "No"}
[VOLATIL] Volatilidad de Evidencia: ${result.evidenceIsAutoDeleted ? "SÍ - PRESERVACIÓN URGENTE" : "Estable"}
[ESTADO] Afectación Emocional: ${result.hasEmotionalDistress ? "SÍ - REQUIERE EMPATÍA" : "No declarada"}

3. PERFIL COGNITIVO (SCREENING PSICO-FORENSE)
--------------------------------------------
- Coherencia Inicial: ${result.cognitiveProfile?.coherenceScore ?? "N/A"}/5
- Distorsión Cognitiva: ${result.cognitiveProfile?.cognitiveDistortion ? "DETECTADA" : "Ausencia aparente"}
- Percepción de Omnipotencia del Atacante: ${result.cognitiveProfile?.perceivedOmnipotenceOfAttacker ? "SÍ (Posible sesgo paranoide)" : "No"}
- Verificabilidad de Información: ${result.cognitiveProfile?.isInformationVerifiable ? "Alta (Basada en pruebas)" : "Baja (Basada en intuiciones)"}
- Nivel de Shock: ${(result.cognitiveProfile?.emotionalShockLevel || "N/A").toUpperCase()}

4. TRAZADO DE NARRATIVA (EMERGENCIA)
-----------------------------------
- Pérdida control WhatsApp/Telecom: ${result.narrativeTracing?.whatsappControlLoss ? "SÍ" : "No"}
- Sospecha Entorno Familia/Cercano: ${result.narrativeTracing?.familySuspects ? "SÍ" : "No"}
- Percepción Vigilancia Omnipresente: ${result.narrativeTracing?.perceivedSurveillance ? "SÍ" : "No"}

5. EVALUACIÓN DEL MOTOR (DETERMINISTA)
--------------------------------------
PRIORIDAD SUGERIDA: ${decision.priority.toUpperCase()}
RUTA DE SEGUIMIENTO: ${decision.route}
ACCIÓN INMEDIATA: ${decision.actionCode}
FLAGS DE DEPURACIÓN: ${decision.flags.join(", ") || "Ninguno"}

5. RESUMEN DEL INCIDENTE (DECLARACIÓN ORIGINAL)
-----------------------------------------------
"${result.incident}"

5. NOTA TÉCNICA PARA EL PERITO
------------------------------
Este informe se ha generado mediante un motor de decisión determinista v2.
Se recomienda validar la integridad de los dispositivos mencionados (${result.devices} dispositivos declarados) 
y asegurar la cadena de custodia si el caso procede a fase judicial.

---------------------------------------------------------
Fin del informe.
  `;

  const body = `
Se ha recibido un nuevo caso forense de alta sensibilidad.
Se adjunta el Informe de Triage Detallado para tu revisión técnica.

Resumen rápido:
- Cliente: ${userEmail}
- Prioridad: ${decision.priority.toUpperCase()}
- Riesgo Físico: ${result.physicalSafetyRisk ? "SÍ" : "NO"}

Este email ha sido generado por el Decision Engine de Clarity Structures.
  `;

  try {
    await transporter.sendMail({
      from: '"Clarity Structures Engine" <no-reply@claritystructures.com>',
      to: recipient,
      replyTo: userEmail,
      subject,
      text: body,
      attachments: [
        {
          filename: `Informe_Forense_${caseId}.txt`,
          content: reportContent,
        },
      ],
    });
  } catch (error) {
    console.error("[CRITICAL] Failed to send forensic intake email:", error);
    // Silent fail in production to avoid breaking the UI, but should be logged.
  }
}
